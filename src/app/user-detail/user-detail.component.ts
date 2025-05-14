import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatIconButton, CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  userId: string = '';
  user: User = new User();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private dialog: MatDialog
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
      data: { field, value: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (field === 'Geburtstag') {
        this.user.birthDate = (result as Date).toISOString();
      } else if (typeof result === 'object') {
        Object.assign(this.user, result);
      } else {
        const key = keys as keyof User;
        (this.user as any)[key] = result;
      }

      this.userService.updateUser(this.userId, this.user);
    });
  }
}
