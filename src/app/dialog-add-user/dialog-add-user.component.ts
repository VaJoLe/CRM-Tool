import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dialog-add-user',
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
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  user = new User();
  birthDate: Date | null = null;
  date!: string;
  loading = false;
  datePart: Date | null = null;
timePart: string = '';


  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    private userService: UserService
  ) {}

  saveUser() {
    this.loading = true;
    const isValidDate = (date: any): date is Date =>
      date instanceof Date && !isNaN(date.getTime());

    this.user.birthDate = isValidDate(this.birthDate)
      ? this.birthDate.toISOString()
      : '';

    if (
    isValidDate(this.user.date) &&
    this.timePart &&
    /^\d{2}:\d{2}$/.test(this.timePart)
  ) {
    const [h, m] = this.timePart.split(':').map(Number);
    const dateWithTime = new Date(this.user.date);
    dateWithTime.setHours(h, m, 0, 0);
    this.user.date = dateWithTime.toISOString(); // ✅ wichtig!
  } else {
    this.user.date = '';
  }

    this.userService.addUser(this.user).then(() => {
      this.loading = false;
      this.dialogRef.close();
    });
  }
}
