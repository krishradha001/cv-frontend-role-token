import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagementServicesService {
  private baseUrl = environment.realApiUrl;
  constructor(private http: HttpClient) { }
  
  taskdispensation(){
    return this.http.get(this.baseUrl+"/task_dispensation");
  }
  remedtrack(){
    return this.http.get(this.baseUrl+"/remediation_tracker");

  }
  moderntrack(){
    return this.http.get(this.baseUrl+"/modernisation_tracker");

  }
  ptidata(id){
    console.log(id);
    return this.http.get(this.baseUrl+"/tasks/"+ id);
  
  }
  time(){
    
    return this.http.get(this.baseUrl+"/tasks/health");
  
  }




}



