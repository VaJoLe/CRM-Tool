import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  provideNativeDateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatProgressBarModule,
    NgIf,
  ],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss',
})
export class DialogEditUserComponent {
  // ladebalken einfügen wieder
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { field: string; value: any; userId: string },
    private userService: UserService
  ) {}

  save() {
    this.loading = true;

    const userId = this.data.userId;
    const value = this.data.value;

    let updateData: Partial<User>;

    // Felder wie E-Mail, Telefonnummer oder Geburtstag liefern nur einen einfachen Wert
    switch (this.data.field) {
      case 'E-Mail':
        updateData = { mail: value };
        break;
      case 'Telefonnummer':
        updateData = { phone: value };
        break;
      case 'Geburtstag':
        updateData = { birthDate: value.toISOString?.() ?? value };
        break;
      case 'Termin':
        updateData = { date: value.toISOString?.() ?? value };
        break;
      case 'Notiz':
        updateData = { notice: value };
        break;
      default:
        updateData = value; // Name, Adresse = Objekt
    }

    this.userService
      .updateUser(userId, updateData)
      .then(() => {
        this.loading = false;
        this.dialogRef.close(updateData); // als Objekt zurückgeben
      })
      .catch((error) => {
        console.error('Fehler beim Speichern in Firebase:', error);
        this.loading = false;
      });
  }
}
// alles auf englisch und delet button bei name edit dashboard noch bearbeiten
