import { Component, Input, OnChanges, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { validate } from 'uuid';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: IClip | null = null;
  inSubmission: boolean = false;
  showAlert: boolean = false;
  alertMsg: string  = 'Please wait! Updating clip';
  alertColor: string = 'blue';
  @Output() update = new EventEmitter()

  clipID = new FormControl('', { nonNullable: true });
  title = new FormControl('', {validators : [Validators.required, Validators.minLength(3)], nonNullable: true })
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(
      private modal: ModalService,
      private clipService: ClipService
    ) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip')
  }

  ngOnChanges(): void {
    if(!this.activeClip) {
      return
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID!);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {

    if(!this.activeClip) {
      return
    }

    this.showAlert = true;
    this.alertMsg = 'Please wait! Updating clip.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      
      await this.clipService.updateClip(this.clipID.value, this.title.value)

    } catch(error) {
      
      this.alertMsg = 'Oops. Something went wrong! Try again later.';
      this.alertColor = 'red';
      this.inSubmission = false;
      return
    }

    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)

    this.alertMsg = 'Success.';
    this.alertColor = 'green';
    this.inSubmission = true;

  }
}
