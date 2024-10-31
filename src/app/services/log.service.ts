import { inject, Injectable } from '@angular/core';
import { LogInterface, LogInterfaceId } from '../interfaces/log';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  firestore = inject(Firestore);

  guardarLog(log: LogInterface) {
    const col = collection(this.firestore, 'logs');
    return addDoc(col, log);
  }
  traerLog() {
    const col = collection(this.firestore, 'logs');
    return collectionData(col, { idField: 'id' }) as Observable<
      LogInterfaceId[]
    >;
  }
}
