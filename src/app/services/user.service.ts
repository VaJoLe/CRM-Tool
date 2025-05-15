import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersCollection = collection(this.firestore, 'users');

  constructor(private firestore: Firestore) {}

  addUser(user: User) {
    const userRef = collection(this.firestore, 'users');
    return addDoc(userRef, user.toJSON());
  }

  getUsers(): Observable<User[]> {
    return collectionData(this.usersCollection, {
      idField: 'id',
    }) as Observable<User[]>;
  }

  getUserById(id: string) {
    const userDocRef = doc(this.usersCollection, id);
    return getDoc(userDocRef);
  }

  updateUser(userId: string, data: Partial<User>): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(userRef, data);
  }

  deleteUser(userId: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    return deleteDoc(userRef);
  }
}
