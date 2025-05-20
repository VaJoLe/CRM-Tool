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
  birthDateInvalid = false;
  birthDateInputValue = '';
  dateInvalid = false;
  dateInputValue = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    private userService: UserService
  ) {}

  saveUser(): void {
    this.loading = true;

    if (this.birthDateInvalid || this.dateInvalid) {
      return;
    }

    this.prepareUserDates();

    this.userService.addUser(this.user).then(() => {
      this.loading = false;
      this.dialogRef.close();
    });
  }

  private prepareUserDates(): void {
    this.user.birthDate = this.formatBirthDate(this.birthDate);
    this.user.date = this.combineDateAndTime(this.user.date, this.timePart);
  }

  private formatBirthDate(date: any): string {
    return this.isValidDate(date) ? date.toISOString() : '';
  }

  private combineDateAndTime(date: any, time: string): string {
    if (this.isValidDate(date) && time && /^\d{2}:\d{2}$/.test(time)) {
      const [h, m] = time.split(':').map(Number);
      const combined = new Date(date);
      combined.setHours(h, m, 0, 0);
      return combined.toISOString();
    }
    return '';
  }

  private isValidDate(date: any): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }

  onRawDateInput(event: any, target: 'birthDate' | 'date'): void {
    const raw = this.formatRawDate(event.target.value);
    event.target.value = raw;

    const parsedDate = this.parseAndValidateDate(raw);

    if (target === 'birthDate') {
      this.birthDateInputValue = raw;
      this.birthDate = parsedDate;
      this.birthDateInvalid = !parsedDate;
    } else {
      this.dateInputValue = raw;
      this.user.date = parsedDate ? parsedDate.toISOString() : '';
      this.dateInvalid = !parsedDate;
    }
  }

  private formatRawDate(input: string): string {
    let raw = input.replace(/\D/g, '');

    if (raw.length >= 3 && raw.length <= 4)
      raw = raw.slice(0, 2) + '.' + raw.slice(2);
    else if (raw.length >= 5)
      raw = raw.slice(0, 2) + '.' + raw.slice(2, 4) + '.' + raw.slice(4, 8);

    return raw;
  }

  private parseAndValidateDate(raw: string): Date | null {
    const parts = raw.split('.');
    if (parts.length !== 3) return null;

    const [dayStr, monthStr, yearStr] = parts;
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1700 ||
      year > 2100
    ) {
      return null;
    }

    const date = new Date(year, month - 1, day);

    // Sicherheitsabgleich gegen Überlauf
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }
}
