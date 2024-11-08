import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  historialInterface,
  historialInterfaceId,
} from '../interfaces/historial';

@Injectable({
  providedIn: 'root',
})
export class HistorialClinicaService {
  router = inject(Router);
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, 'historial-clinica');

  mailPaciente: string = '';
  mailEspecialista: string = '';
  idTurno: string = '';
  especialidadEspecialista: string = '';

  saveHistoriaClinica(historial: historialInterface) {
    return addDoc(this._collection, historial);
  }

  getHistoriaClinica() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      historialInterfaceId[]
    >;
  }

  async getHistoriaClinicaId(
    emailPaciente: string | undefined | null
  ): Promise<any> {
    const q = query(
      this._collection,
      where('mailPaciente', '==', emailPaciente)
    );
    const usersSnapshot = await getDocs(q);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        ...userData,
      };
    } else {
      return null;
    }
  }

  async getHistoriaClinicaIdTurno(
    idTurno: string | undefined | null
  ): Promise<any> {
    const q = query(this._collection, where('idTurno', '==', idTurno));
    const usersSnapshot = await getDocs(q);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        ...userData,
      };
    } else {
      return null;
    }
  }

  updateHistoriaClinica(id: string, turno: historialInterface) {
    const documentRef = doc(this._collection, id);
    return updateDoc(documentRef, { ...turno });
  }

  deleteHistoriaClinica(id: string) {
    const documentRef = doc(this._collection, id);
    return deleteDoc(documentRef);
  }
}
