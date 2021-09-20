import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './loginModule/_services';
import { User } from './loginModule/_models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })

export class AppComponent {
    isDisplay=true;
    toggle()
    {
        this.isDisplay=!this.isDisplay;
    }
    currentUser: User;

    // constructor(
    //     private router: Router,
    //     private authenticationService: AuthenticationService
    // ) {
    //     // this.currentUser = true;
    //     this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    // }

    // logout() {
    //     this.authenticationService.logout();
    //     this.router.navigate(['/login']);
    // }
}