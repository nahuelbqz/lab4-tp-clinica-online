import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { turnoInterface, turnoInterfaceId } from '../interfaces/turno';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  router = inject(Router);
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, 'turnos');

  saveTurno(turno: turnoInterface) {
    return addDoc(this._collection, turno);
  }
  getTurnos() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      turnoInterfaceId[]
    >;
  }
  async getTurno(id: string) {
    const q = query(this._collection, where('id', '==', id));
    const usersSnapshot = await getDocs(q);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      return userData || null;
    } else {
      return null;
    }
  }
  updateTurno(id: string, turno: turnoInterface) {
    const documet = doc(this._collection, id);
    return updateDoc(documet, { ...turno });
  }
  deleteTurno(id: string) {
    const documet = doc(this._collection, id);
    deleteDoc(documet);
  }
}
