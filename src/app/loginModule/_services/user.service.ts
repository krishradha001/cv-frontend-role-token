import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


//import { User } from '../_models/user';
import { User } from '../_models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '.';

@Injectable({ providedIn: 'root' })
export class UserService {
    
    constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
        this.user = this.authenticationService.userValue; 
    }

    user: User = this.authenticationService.userValue;
    baseUrl: string = environment.realApiUrl;

    
    // headers_ = new HttpHeaders()
    // .set("Authorization", "Bearer " + this.user["token"]);

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    registerUser(data){
        return this.http.post(this.baseUrl + "/signup", JSON.stringify(data) );        
    }
}