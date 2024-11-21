import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';
import { UsuarioInterface } from '../interfaces/usuario';
import { EspecialistaInterface } from '../interfaces/especialista';
import { PacienteInterface } from '../interfaces/paciente';
import { AdminInterface } from '../interfaces/admin';

const PATH = 'usuarios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  mailActual: string = '';
  passActual: string = '';
  //Auth
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UsuarioInterface | null | undefined>(undefined);

  register(email: string, password: string) {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((r) => {
      sendEmailVerification(r.user);
      this.logout();
    });
    return promise;
  }
  login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    return promise;
  }
  logout() {
    const promise = signOut(this.firebaseAuth);
    return promise;
  }

  // FIRESTORAGE
  router = inject(Router);
  private _firestore = inject(Firestore);
  private storage = inject(Storage);
  private _collection = collection(this._firestore, PATH);

  getUsuarios() {
    return collectionData(this._collection, { idField: 'id' }) as Observable<
      any[]
    >;
  }
  async getUsuario(email: string | undefined | null): Promise<any> {
    const q = query(this._collection, where('mail', '==', email));
    const usersSnapshot = await getDocs(q);
    if (!usersSnapshot.empty) {
      const userDoc = usersSnapshot.docs[0];
      const userData = userDoc.data();
      return userData || null;
    } else {
      return null;
    }
  }

  async getUsuarioId(email: string | undefined | null): Promise<any> {
    const q = query(this._collection, where('mail', '==', email));
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
  
  updateUsuarioEspecialista(id: string, especialista: EspecialistaInterface) {
    return updateDoc(this.document(id), { ...especialista });
  }
  private document(id: string) {
    return doc(this._firestore, `${PATH}/${id}`);
  }

  //REGISTRO PACIENTE
  async createUsuarioPaciente(paciente: any, foto1: File, foto2: File) {
    let hora = new Date().getTime();
    let path1 = '/' + paciente.nombre + hora + '1';
    let path2 = '/' + paciente.nombre + hora + '2';
    const imgRef1 = ref(this.storage, path1);
    const imgRef2 = ref(this.storage, path2);
    let retorno = false;
    let urlFoto1 = '';

    await uploadBytes(imgRef1, foto1).then(async () => {
      const url1 = await getDownloadURL(imgRef1).then(async (resultado) => {
        retorno = true;
        urlFoto1 = resultado;
      });
    });
    if (retorno) {
      await uploadBytes(imgRef2, foto2).then(async () => {
        const url2 = await getDownloadURL(imgRef2)
          .then(async (resultado) => {
            let data: PacienteInterface = {
              nombre: paciente.nombre,
              apellido: paciente.apellido,
              edad: paciente.edad,
              dni: paciente.dni,
              obraSocial: paciente.obraSocial,
              mail: paciente.mail,
              imagenUno: urlFoto1,
              imagenDos: resultado,
              rol: 'paciente',
            };
            await addDoc(this._collection, data)
              .then(() => {
                retorno = true;
              })
              .catch(() => {
                retorno = false;
              });
          })
          .catch(() => {
            retorno = false;
          });
      });
    }
    return retorno;
  }
  //REGISTRO ESPECIALISTA
  async createUsuarioEspecialista(
    especialista: any,
    foto: File,
    especialidades: any
  ) {
    let hora = new Date().getTime();
    let path = '/' + especialista.nombre + hora;
    const imgRef = ref(this.storage, path);
    let retorno = false;
    await uploadBytes(imgRef, foto).then(async () => {
      const url1 = await getDownloadURL(imgRef).then(async (resultado) => {
        let data: EspecialistaInterface = {
          nombre: especialista.nombre,
          apellido: especialista.apellido,
          edad: especialista.edad,
          dni: especialista.dni,
          especialidad: especialidades,
          mail: especialista.mail,
          imagenUno: resultado,
          estaValidado: false,
          rol: 'especialista',
          deSemana: 8,
          hastaSemana: 19,
          deSabado: 8,
          hastaSabado: 14,
          usuariosAtentidos: [],
        };
        await addDoc(this._collection, data).then(() => {
          retorno = true;
        });
      });
    });
    return retorno;
  }

  //REGISTRO ADMIN
  async createUsuarioAdmin(admin: any, foto: File) {
    let hora = new Date().getTime();
    let path = '/' + admin.nombre + hora;
    const imgRef = ref(this.storage, path);
    let retorno = false;
    await uploadBytes(imgRef, foto).then(async () => {
      const url1 = await getDownloadURL(imgRef).then(async (resultado) => {
        let data: AdminInterface = {
          nombre: admin.nombre,
          apellido: admin.apellido,
          edad: admin.edad,
          dni: admin.dni,
          mail: admin.mail,
          imagenUno: resultado,
          rol: 'admin',
        };
        await addDoc(this._collection, data).then(() => {
          retorno = true;
        });
      });
    });
    return retorno;
  }
}
