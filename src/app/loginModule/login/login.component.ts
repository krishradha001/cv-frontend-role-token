import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService, UserService } from '../_services';
import { DOCUMENT } from '@angular/common';
import { User } from '../_models';

@Component(
    { 
        selector: 'app-login',
        templateUrl: 'login.component.html', 
        styleUrls: ['./login.component.css']
    })

    export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    a;
    user: User;
    userFromApi: User;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        @Inject(DOCUMENT) private document: Document
    ) { 
        this.user = this.authenticationService.userValue;
        // redirect to home if already logged in
        if (this.authenticationService.userValue) { 
            console.log(JSON.parse(localStorage.getItem('user')));
            this.authenticationService.manageAccessUserByRole(this.user.role);
        }else{
            console.log(JSON.parse(localStorage.getItem('user')));
        }
        
        // console.log(this.user);
    }

    ngOnInit() {
        console.log(JSON.parse(localStorage.getItem('user')));
        this.document.body.classList.add('loginPage');
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // console.log(this.authenticationService.userValue);

        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;      
        // this.router.navigate(['/home']);

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        // this.loading = true;

        // console.log(this.user);

        // this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
        //     this.loading = false;
        //     this.userFromApi = user;

        //     console.log(this.userFromApi);
        // });

        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.loading = false;
                    // get return url from query parameters or default to home page
                    this.user = this.authenticationService.userValue;
                    this.authenticationService.manageAccessUserByRole(this.user.role);
                    
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
}
