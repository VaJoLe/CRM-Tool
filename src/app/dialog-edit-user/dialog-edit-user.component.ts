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
  birthDateInvalid = false;
  appointmentDateInvalid = false;

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { field: string; value: any; userId: string },
    private userService: UserService
  ) {
    this.initDateTime();
    this.initAddress();
  }

  private initDateTime(): void {
    if (this.data.field === 'Termin' && typeof this.data.value === 'string') {
      const date = new Date(this.data.value);
      if (!isNaN(date.getTime())) {
        this.datePart = date;

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        this.timePart = `${hours}:${minutes}`;
      }
    }
  }

  private initAddress(): void {
    if (
      this.data.field === 'Adresse' &&
      (!this.data.value ||
        typeof this.data.value !== 'object' ||
        !('street' in this.data.value) ||
        !('zipCode' in this.data.value) ||
        !('city' in this.data.value))
    ) {
      this.data.value = {
        street: '',
        zipCode: '',
        city: '',
      };
    }
  }

  save(): void {
    this.loading = true;

    if (
      (this.data.field === 'Geburtstag' && this.birthDateInvalid) ||
      (this.data.field === 'Termin' && this.appointmentDateInvalid)
    ) {
      this.loading = false;
      return;
    }

    const userId = this.data.userId;
    const updateData = this.buildUpdateData();

    this.userService.updateUser(userId, updateData).then(() => {
      this.loading = false;
      this.dialogRef.close(updateData);
    });
  }

  private buildUpdateData(): Partial<User> {
    const field = this.data.field;
    const value = this.data.value;

    switch (field) {
      case 'E-Mail':
        return { mail: value };

      case 'Telefonnummer':
        return { phone: value };

      case 'Geburtstag':
        return {
          birthDate: this.isValidDate(value) ? value.toISOString() : '',
        };

      case 'Termin':
        return { date: this.buildDateTimeString(this.datePart, this.timePart) };

      case 'Notiz':
        return { notice: value };

      case 'Namen':
      case 'Adresse':
        return value;

      default:
        return {};
    }
  }

  private isValidDate(d: any): d is Date {
    return d instanceof Date && !isNaN(d.getTime());
  }

  private buildDateTimeString(datePart: any, timePart: string): string {
    if (this.isValidDate(datePart) && /^\d{2}:\d{2}$/.test(timePart)) {
      const [h, m] = timePart.split(':').map(Number);
      const localDate = new Date(
        datePart.getFullYear(),
        datePart.getMonth(),
        datePart.getDate(),
        h,
        m,
        0
      );
      return localDate.toISOString();
    }
    return '';
  }

  onRawDateInput(
    event: any,
    target: 'birthDate' | 'appointment' = 'birthDate'
  ): void {
    const raw = this.formatRawDate(event.target.value);
    event.target.value = raw;

    const parsedDate = this.parseAndValidateDate(raw);

    this.updateTargetField(target, parsedDate);
  }

  private formatRawDate(input: string): string {
    let raw = input.replace(/\D/g, '');

    if (raw.length >= 3 && raw.length <= 4) {
      raw = raw.slice(0, 2) + '.' + raw.slice(2);
    } else if (raw.length >= 5) {
      raw = raw.slice(0, 2) + '.' + raw.slice(2, 4) + '.' + raw.slice(4, 8);
    }

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
      year < 1900 ||
      year > 2100
    ) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  private updateTargetField(
    target: 'birthDate' | 'appointment',
    date: Date | null
  ): void {
    const isValid = !!date;

    if (target === 'birthDate') {
      this.data.value = date;
      this.birthDateInvalid = !isValid;
    } else if (target === 'appointment') {
      this.datePart = date;
      this.appointmentDateInvalid = !isValid;
    }
  }
}
