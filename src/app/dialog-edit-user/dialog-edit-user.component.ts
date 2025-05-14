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
    @Inject(MAT_DIALOG_DATA) public data: { field: string; value: any }
  ) {}

  save(): void {
    this.loading = true;

    if (this.data.field === 'Geburtstag') {
      const date: Date = this.data.value;
      this.dialogRef.close(date);
    } else {
      this.dialogRef.close(this.data.value);
    }
  }
}
// alles auf englisch und delet button bei name edit dashboard noch bearbeiten