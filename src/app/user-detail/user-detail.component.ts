import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatIconButton,
    CommonModule,
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  userId: string = '';
  user: User = new User();
  keys: (keyof User)[] = [
    'firstName',
    'lastName',
    'birthDate',
    'mail',
    'phone',
    'street',
    'zipCode',
    'city',
    'notice',
    'date',
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.getUserData();
  }

  getUserData(): void {
    this.userService.getUserById(this.userId).then((userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.user = new User(userData);
        this.user.id = userDoc.id;
        this.userId = userDoc.id;
      }
    });
  }

  openEdit(field: keyof User | string, keys: keyof User | (keyof User)[]) {
    (document.activeElement as HTMLElement)?.blur();

    let data: any;

    if (field === 'Geburtstag' || field === 'Termin') {
      const key = keys as keyof User;
      data = this.user[key]
        ? new Date(this.user[key] as string | number | Date)
        : null;
    } else if (Array.isArray(keys)) {
      const updateData: Partial<User> = {};

      (keys as (keyof User)[]).forEach((key) => {
        updateData[key] = this.user[key as keyof User];
      });
    } else {
      const key = keys as keyof User;
      data = this.user[key];
    }

    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      data: {
        field,
        value: data,
        userId: this.user.id,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (field === 'Geburtstag') {
        this.user.birthDate = (result as any).birthDate;
      } else if (field === 'Termin') {
        this.user.date = (result as any).date;
      } else if (typeof result === 'object') {
        Object.assign(this.user, result);
      } else {
        const key = keys as keyof User;
        this.user[key] = result;
      }

      let updatedFields: Partial<User>;

      if (typeof result === 'object') {
        updatedFields = result;
      } else {
        const key = Array.isArray(keys) ? keys[0] : keys;
        updatedFields = { [key]: result } as Partial<User>;
      }

      this.userService
        .updateUser(this.userId, updatedFields)
        .then(() => console.log('Update erfolgreich'))
        .catch((err) => console.error('Update fehlgeschlagen', err));
    });
  }

  saveNotice() {
    this.userService
      .updateUser(this.userId, { notice: this.user.notice })
      .then(() => console.log('Notiz gespeichert'))
      .catch((err) => console.error('Fehler beim Speichern der Notiz:', err));
  }

  deleteUser() {
    const confirmed = confirm('Möchten Sie diesen Kontakt wirklich löschen?');
    if (confirmed && this.user?.id) {
      this.userService
        .deleteUser(this.user.id)
        .then(() => {
          // Nach erfolgreichem Löschen zurück zur Liste
          this.router.navigate(['/user']);
        })
        .catch((error) => console.error('Fehler beim Löschen:', error));
    }
  }
}
