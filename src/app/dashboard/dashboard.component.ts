import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // ggf. Pfad anpassen
import { User } from '../../models/user.class';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    NgIf,
    NgFor,
    MatListModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  searchTerm: string = '';
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  usersWithAppointments: User[] = [];
  greeting: string = '';
  currentDate: string = '';
  currentTime: string = '';
  totalUsers: number = 0;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.setGreeting();
    this.initializeDateTimeUpdater();
    this.loadAndProcessUsers();
  }

  private initializeDateTimeUpdater(): void {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }

  private loadAndProcessUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.allUsers = users;
      this.totalUsers = users.length;
      this.processUsersWithAppointments(users);
    });
  }

  private processUsersWithAppointments(users: User[]): void {
    this.usersWithAppointments = users
      .filter((user) => user.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredUsers = [];
      return;
    }

    this.filteredUsers = this.allUsers.filter(
      (user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
        user.mail.toLowerCase().includes(term)
    );
  }

  goToUserDetail(userId: string) {
    if (userId) {
      this.router.navigate(['/user', userId]);
    } else {
      console.error('ID fehlt in goToUserDetail()');
    }
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 11) {
      this.greeting = 'Guten Morgen';
    } else if (hour < 18) {
      this.greeting = 'Guten Tag';
    } else {
      this.greeting = 'Guten Abend';
    }
  }

  updateDateTime() {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.currentTime = now.toLocaleTimeString('de-DE');
  }
}
