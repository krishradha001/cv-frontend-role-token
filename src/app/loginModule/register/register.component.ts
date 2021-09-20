import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { AuthenticationService, UserService } from '../_services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private loginService: UserService, private authenticationService: AuthenticationService) { 
    this.user = this.authenticationService.userValue;
        // redirect to home if already logged in
        if (this.authenticationService.userValue) { 
            console.log(JSON.parse(localStorage.getItem('user')));
            this.authenticationService.manageAccessUserByRole(this.user.role);
        }else{
            console.log(JSON.parse(localStorage.getItem('user')));
        }

  }

  user: User;
  username:string;
  firstName:string;
  lastName:string;
  password:string;
  confirmPassword:string;
  acceptConditions:Boolean;
  registerBtn:Boolean;
  passMismatch:Boolean;
  loginAndcontinue:any;

  ngOnInit(): void {
    this.username= '';
    this.firstName='';
    this.lastName='';
    this.password='';
    this.confirmPassword='';
    this.acceptConditions=false;
    this.registerBtn = true;
    this.passMismatch = false;
    this.loginAndcontinue="";
  }

  validte(){
    console.log("logiing");
    console.log("username: " + this.username + " first Name: " + this.firstName + " lastname: " + this.lastName + " pass: " + this.password + " confirm pass:  " + this.confirmPassword + " confirm cond: " + this.acceptConditions);
    if(this.username && this.firstName && this.lastName && this.password && this.confirmPassword && this.acceptConditions){
      // this.registerBtn = false;
      console.log("username: " + this.username + " first Name: " + this.firstName + " lastname: " + this.lastName + " pass: " + this.password + " confirm pass:  " + this.confirmPassword + " confirm cond: " + this.acceptConditions);
      if(this.password == this.confirmPassword){
        this.passMismatch = false;
        this.registerBtn = false;
      }else{
        this.registerBtn = true;
        this.passMismatch = true;
      }
    }
  }

  frmSubmit(){
    this.registerBtn = true;
    let userData = {"username": this.username, "first_name": this.firstName, "last_name": this.lastName,  "password" : this.password}
    this.loginService.registerUser(userData).subscribe(data=>
      { this.loginAndcontinue = data;}
      );
  }

  checkErr(){
    if(this.passMismatch == true){
      return "input-group border border-danger";
    }else{
      return "input-group";
    }
  }
}
