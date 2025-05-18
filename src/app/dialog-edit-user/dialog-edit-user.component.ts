import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
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
  loading = false;
  datePart: Date | null = null;
  timePart: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { field: string; value: any; userId: string },
    private userService: UserService
  ) {
    if (this.data.field === 'Termin' && typeof this.data.value === 'string') {
  const date = new Date(this.data.value);
  if (!isNaN(date.getTime())) {
    this.datePart = date;
    this.timePart = date.toISOString().substring(11, 16); // z. B. "14:30"
  }
}

  }

  save() {
    this.loading = true;

    const userId = this.data.userId;
    const value = this.data.value;

    let updateData: Partial<User>;

    // Hilfsfunktion zur Validierung eines Datums
    const isValidDate = (d: any): d is Date =>
      d instanceof Date && !isNaN(d.getTime());

    switch (this.data.field) {
      case 'E-Mail':
        updateData = { mail: value };
        break;

      case 'Telefonnummer':
        updateData = { phone: value };
        break;

      case 'Geburtstag':
        updateData = {
          birthDate: isValidDate(value) ? value.toISOString() : '',
        };
        break;

      case 'Termin':
  if (
    this.datePart instanceof Date &&
    !isNaN(this.datePart.getTime()) &&
    /^\d{2}:\d{2}$/.test(this.timePart)
  ) {
    const [h, m] = this.timePart.split(':').map(Number);
    const combined = new Date(this.datePart);
    combined.setHours(h, m, 0, 0);
    updateData = { date: combined.toISOString() };
  } else {
    updateData = { date: '' };
  }
  break;

      case 'Notiz':
        updateData = { notice: value };
        break;

      default:
        updateData = value; // z. B. Name oder Adresse
    }

    this.userService
      .updateUser(userId, updateData)
      .then(() => {
        this.loading = false;
        this.dialogRef.close(updateData);
      })
      .catch((error) => {
        console.error('Fehler beim Speichern in Firebase:', error);
        this.loading = false;
      });
  }
}
