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

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatIconButton,
    CommonModule,
    MatMenuModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  userId: string = '';
  user: User = new User();

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

  openEdit(field: string, keys: keyof User | (keyof User)[]) {
    (document.activeElement as HTMLElement)?.blur();

    let data: any;

    if (field === 'Geburtstag') {
      const key = keys as keyof User;
      data = new Date(this.user[key]);
    } else if (Array.isArray(keys)) {
      data = keys.reduce((acc, key) => {
        acc[key] = this.user[key];
        return acc;
      }, {} as Partial<User>);
    } else {
      const key = keys as keyof User;
      data = this.user[key];
    }

    const dialogRef = this.dialog.open(DialogEditUserComponent, {
      data: {
        field,
        value: data,
        userId: this.user.id, // << hier wird die ID an den Dialog übergeben
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      // Werte im lokalen User-Objekt aktualisieren
      if (field === 'Geburtstag') {
        this.user.birthDate = (result as any).birthDate;
      } else if (typeof result === 'object') {
        Object.assign(this.user, result);
      } else {
        const key = keys as keyof User;
        (this.user as any)[key] = result;
      }

      let updatedFields: Partial<User>;

      if (typeof result === 'object') {
        updatedFields = result;
      } else {
        // keys ist entweder ein string oder ein array von strings → korrekt extrahieren
        const key = typeof keys === 'string' ? keys : keys[0];
        updatedFields = { [key]: result } as Partial<User>;
      }

      this.userService
        .updateUser(this.userId, updatedFields)
        .then(() => console.log('Update erfolgreich'))
        .catch((err) => console.error('Update fehlgeschlagen', err));
    });
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
