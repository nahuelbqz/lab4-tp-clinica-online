import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  EspecialidadInterface,
  EspecialidadInterfaceId,
} from '../interfaces/especialidad';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, 'especialidad');

  getEspecialidad() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      EspecialidadInterfaceId[]
    >;
  }
  createEspecialidad(user: EspecialidadInterface) {
    return addDoc(this._collection, user);
  }
  updateEspecialidad(id: string, user: EspecialidadInterface) {
    return updateDoc(this.document(id), { ...user });
  }
  deleteEspecialidad(id: string) {
    return deleteDoc(this.document(id));
  }
  private document(id: string) {
    return doc(this._firestore, `${'especialidad'}/${id}`);
  }
}
