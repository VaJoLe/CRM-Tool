import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from '../../models/user.class';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../services/user.service';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    NgFor,
    RouterModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  allUsers: User[] = [];

  constructor(public dialog: MatDialog, private userService: UserService) {}

  openDialog(): void {
    (document.activeElement as HTMLElement)?.blur();

    this.dialog.open(DialogAddUserComponent, {
      autoFocus: false,
    });
  }
  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.allUsers = data.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });
  }
}
