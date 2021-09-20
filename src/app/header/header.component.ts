import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '../loginModule/_models/user';
import { UserService } from '../loginModule/_services';
import { AuthenticationService } from '../loginModule/_services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // [x: string]: any;
  // route:any;
  // currentUser: User;

  loading = false;
  user: User;
  userFromApi: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService
) {
    this.user = this.authenticationService.userValue;
}

ngOnInit() {
    this.loading = true;
    this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
        this.loading = false;
        this.userFromApi = user;
    });
}

  // constructor(
  //       private router: Router,
  //       private authenticationService: AuthenticationService
  //   ) {
  //       this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  //   }
  // ngOnInit() {
  //   // throw new Error('Method not implemented.');
  // }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}