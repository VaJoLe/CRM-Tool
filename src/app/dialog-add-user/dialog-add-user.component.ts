import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../../models/user.class';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-dialog-add-user',
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
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  user = new User();
  birthDate!: string;
  date!: string;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    private userService: UserService
  ) {}

  saveUser() {
    this.loading = true;
    this.user.birthDate = new Date(this.birthDate).toISOString();
    this.user.date = new Date(this.user.date).toISOString();

    this.userService.addUser(this.user).then(() => {
      this.loading = false;
      this.dialogRef.close();
    });
  }
}
