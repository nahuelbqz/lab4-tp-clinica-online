import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'clinica-online-tp-68cea',
        appId: '1:125502848871:web:f3e9e01fc883763b2ff9c2',
        storageBucket: 'clinica-online-tp-68cea.appspot.com',
        apiKey: 'AIzaSyDU3q6EAeW-QRi_zqDsfbhVMcQlYmpZ8m8',
        authDomain: 'clinica-online-tp-68cea.firebaseapp.com',
        messagingSenderId: '125502848871',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnimations(), // Required animations providers
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    }), // Toastr providers
    DatePipe,
  ],
};
