import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-btn-log-out',
  templateUrl: './btn-log-out.component.html',
  styleUrls: ['./btn-log-out.component.css'],
})
export class BtnLogOutComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  get user() {
    return this.authService.user;
  }

  ngOnInit(): void {
    console.log('user: ', this.user);
  }

  logOut(): void {
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
