import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../loginModule/_models';
import { AuthenticationService } from '../loginModule/_services';

@Injectable({
  providedIn: 'root'
})
export class MigrateService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.user = this.authenticationService.userValue;
   }

  user: User = this.authenticationService.userValue;
  baseUrl: string = environment.realApiUrl;

  username: string = "username";
  password: string = "password";

  // headers = new HttpHeaders({
  //   'Content-Type': 'application/json'
  // });

    headers_ = new HttpHeaders()
      .set("Authorization", "Bearer " + this.user["token"]);

  options = { headers: this.headers_ };  

  topboxdata() {
    return this.http.get(this.baseUrl + "/topboxdata");
  }

  discovery_data() {
    return this.http.get(this.baseUrl + "/discovery_data");
  }

  recommend_data() {
    return this.http.get(this.baseUrl + "/recommend_data");
  }

  environment_data() {
    return this.http.get(this.baseUrl + "/progress_percent");
  }

  landscape_data() {
    return this.http.get(this.baseUrl + "/landscape_data");
  }

  network_data() {
    return this.http.get(this.baseUrl + "/networkview");
  }

  getApplicationsDetails(items) {
    return this.http.get(
      this.baseUrl + "/app_in_device/" + items
    );
  }
  
  getTechDevDepListDev2Dev(items) {
    return this.http.get(
      this.baseUrl + "/techdevdependency/Dev2Dev/" + items
    );
  }

  getTechDevDepListApp2Dev(items) {
    return this.http.get(
      this.baseUrl + "/techdevdependency/App2Dev/" + items
    );
  }

  getTechDevDepListApp2DevSubItem(itemId) {
    return this.http.get(
      this.baseUrl + "/techdevdependency/Service2Dev/" + itemId
    );
  }
  
  // const headers = { 'Authorization': 'Bearer ' + this.user["token"] }

  getDevicesList() {
    return this.http.get(this.baseUrl + "/devices", { headers: this.headers_ });
  }

  getDevDep(item) {
    return this.http.get(this.baseUrl + "/devicedependencies/" + item);
  }

  getAppDep(item):Observable<any> {
    return this.http.get<any>(this.baseUrl + "/appdependencies/" + item);
  }

  getDeviceUtil(name) {
    return this.http.get(this.baseUrl + "/dcresourcedata?name=" + name);
  }

  getAppUtil(name) {
    return this.http.get(this.baseUrl + "/appresourcedata?name=" + name);
  }

  getDeviceBoxData(name) {
    return this.http.get(this.baseUrl + "/deviceboxdata/" + name);
  }

  questionnare_data() {
    return this.http.get(this.baseUrl + "/upload_ques");
  }

  sourcesystem_data() {
    return this.http.get(this.baseUrl + "/sourcesystemdata");

  }
  movegroup_data() {
    return this.http.get(this.baseUrl + "/showmovegroupdata");

  }
  cloudsuitability_data() {
    return this.http.get(this.baseUrl + "/cloudsuitability");

  }
  cloudcompatibility_data() {
    return this.http.get(this.baseUrl + "/compatibility");

  }
  cloudmigrationsizing_data() {
    return this.http.get(this.baseUrl + "/migrationsizing/");

  }

  discoveryDevicesList() {
    return this.http.get(this.baseUrl + "/config/list");
  }
  configure_data(val) {
    return this.http.get(this.baseUrl + "/config/" + val);

  }
  configured_data(val, data) {
    return this.http.post(this.baseUrl + "/config/" + val, data);
  }

  resource_data() {
    return this.http.get(this.baseUrl + "/devices");

  }

  getNetworkView() {
    return this.http.get(this.baseUrl + "/networkview1");
  }

  getApplicationsView(name) {
    return this.http.get(this.baseUrl + name);
    // return this.http.get(`${this.baseUrl}/all_applications`);
    // return this.http.get(this.baseUrl+"/networkview/"+name);
  }

  getDeviceApiUrl() {
    return this.baseUrl + "/networkview";
  }

  getAppsApiUrl() {
    return this.baseUrl;
  }
  gettargetsizing() {
    return this.http.get(this.baseUrl + "/target_sizing");
  }
  getsavetargetsizing() {
    return this.http.get(this.baseUrl + "/cloud_target_sizing");
  }

  getgcpmigrateview(id: string, i: string): Observable<any> {

    return this.http.get(`${this.baseUrl}/cloud_target_sizing/${id}/${i}`);
  }


  getmigrateviewcurrent(id: string): Observable<any> {

    return this.http.get(`${this.baseUrl}/target_sizing/${id}`);
  }

  getgcpmigrateviewinstance(id: string, i: string): Observable<any> {

    return this.http.get(`${this.baseUrl}/instances/${id}/${i}`);
  }


  getgcpmigrateviewcatalogue(id: string, i: string): Observable<any> {

    return this.http.get(`${this.baseUrl}/catalogue/${id}/${i}`);
  }

  migrationGrpSourceDetails() {
    return this.http.get(this.baseUrl + "/view_migration_groups/migration_groups_source_details");
  }

  migrationGrpConfigTargetetails(id) {
    return this.http.get(`${this.baseUrl}/view_migration_groups/configure_target/${id}`);
  }

  migrationRdyGrp() {
    return this.http.get(this.baseUrl + "/view_migration_groups/migration_ready_groups");
  }

  postConfigureTarget(data) {
    return this.http.post(this.baseUrl + "/view_migration_groups", data);
  }

  postMigrationReady(id) {
    return this.http.get(`${this.baseUrl}/add_to_migration_ready/${id}`);
  }

  migrationWaves() {
    return this.http.get(this.baseUrl + "/migration_waves");
  }

  migrationTimeline() {
    return this.http.get(this.baseUrl + "/migration_timeline");
  }




  createWaveBlock(data: any) {
    return this.http.post(
      this.baseUrl + '/migration_waves',
      JSON.stringify(data),
      { headers: this.headers_ }
    )
  }

  updatedgcpmigrateviewinstance(id, i, indeminity) {
    console.log(id);
    console.log(indeminity);
    return this.http.put(`${this.baseUrl}/catalogue/${id}/${i}`, indeminity);
  }

}
