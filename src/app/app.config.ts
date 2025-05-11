import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"simple-crm-a3de0","appId":"1:382907753108:web:358433fc99ead98d0f0a81","storageBucket":"simple-crm-a3de0.firebasestorage.app","apiKey":"AIzaSyB6Y4__Fv9p918_M7SiOsuhvWnhOtd5n7Q","authDomain":"simple-crm-a3de0.firebaseapp.com","messagingSenderId":"382907753108"})), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};
