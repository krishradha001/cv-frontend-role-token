import { HostListener, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Role, User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User>;
    //private roleSubject: BehaviorSubject<Role>;
    public user: Observable<User>;
   //public role: Observable<Role>;
    

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        //this.roleSubject = new BehaviorSubject<Role>(JSON.parse(localStorage.getItem('role')));
        this.user = this.userSubject.asObservable();
        //this.role = this.roleSubject.asObservable();
    }

    @HostListener("window:onbeforeunload",["$event"])
    clearLocalStorage(event){
        localStorage.clear();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    // public get roleValue(): Role {
    //     return this.roleSubject.value;
    // }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.realApiUrl}/login`, { "username":username, "password" :password })
            .pipe(map(user => {                
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));

            // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            // .pipe(map(user => {                
            //     // store user details and jwt token in local storage to keep user logged in between page refreshes
            //     localStorage.setItem('user', JSON.stringify(user));
            //     this.userSubject.next(user);
            //     return user;
            // }));
    }


    manageAccessUserByRole(userRole){
        // if(userRole){
            if(userRole == 'Admin'){
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
                this.router.navigateByUrl(returnUrl);
            }else
            if(userRole == 'user'){
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user';
                this.router.navigateByUrl(returnUrl);
            }else
            if(userRole == 'Manager'){
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/manager';
                this.router.navigateByUrl(returnUrl);
            }
            else{
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user';
                this.router.navigateByUrl(returnUrl);
            }
        // }else{
        //     const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/guest';
        //     this.router.navigateByUrl(returnUrl);
        // }
    }

    logout() {
        // console.log(localStorage.getItem('user'));
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
        
    }
}