import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import IClip from '../models/clip.model';

@Injectable({
  providedIn: 'root'
})
export class ClipService {

  public clipCollection: AngularFirestoreCollection<IClip>
  
  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { 
    this.clipCollection = db.collection('clips')
  }

  saveClip(data: IClip) : Promise<DocumentReference<IClip>> {
    return this.clipCollection.add(data)
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {

        const [user, sort] = values

        if(!user) {
          return of([])
        }

        const query = this.clipCollection.ref.where('uid', '==', user.uid).orderBy('timestamp', sort === '1' ? 'desc' : 'asc')
        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs) 
    )
  }

  updateClip(id: string, title: string) {
    return this.clipCollection.doc(id).update({title})
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)

    await clipRef.delete()

    await this.clipCollection.doc(clip.docID).delete()

  }
}
