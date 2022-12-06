import firebase from "firebase/compat/app";

export default interface IClip {
    docID?: string;
    uid: string;
    displayName: string;
    fileName: string;
    title: string;  
    url: string;
    timestamp: firebase.firestore.FieldValue;
}