import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MigrateService } from '../services/migrate.service';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-analyse-stats-new',
  templateUrl: './analyse-stats-new.component.html',
  styleUrls: ['./analyse-stats-new.component.css']
})
export class AnalyseStatsNewComponent implements OnInit {

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  vendorsList: any;
  applicationList: any;
  serverAry: any;
  ApsList: any;
  DepList: any;
  dev2AppList:any;
  dev2DepList:any;
  app2DepList:any;
  subApp2DepList:any;
  depListhighlighter:any;
  commanAry: any;
  selectedIndex: any;
  selectedIndex1: any;
  selectedIndex2: any;
  selectedIndex3: any;
  resourcesList: any;
  devDepList: any;
  appDepList: any;
  appCompData: any;
  devServiceData: any;
  devSoftData: any;
  appServiceData: any;
  appSoftData: any;
  dependentOn: any;
  dependsOn: any;
  serviceDepData: any;

  selectedRes: string;
  selectedApp: string;

  appListAryObj:any = [];
  checkAppListAryObj:Boolean = false;
  valuesByKey:any = [];
  appDepTempList:any=[];
  appDepTreeList:any ={};
  parentAppDepTreeList:any ={};

  appListTreeAry: FoodNode[]=[];
  

  tempRes: any;
  tempApp: any;
  tempDep: any;

  constructor(private migrateSer: MigrateService) {
    this.dataSource.data = this.appListTreeAry;
   }
   hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    // this.getAppDetails("USTIMSADAWSW01");
    this.depListhighlighter = {};
    this.getDetailsFrmAppListAryObj("USTIMSADAWSW01");
    // this.getDetailsFrmAppListAryObj("Internet Information Services Version 10.0 - USTIMSADAWSW01");
    this.getValuesByKey("dependent", "Internet Information Services Version 10.0 - USTIMSADAWSW01");
    this.tempRes = ["01 Device ID 101", "02 Device ID 102", "03 Device ID 103", "04 Device ID 104", "05 Device ID 105"];
    this.tempApp = {
      "Application ID 101": ["Service ID 103", "Service ID 24855", "Service ID 455555"],
      "Application ID 102": ["Service ID 107", "Service ID 74855", "Service ID 478455"],
      "Application ID 103": ["Service ID 303", "Service ID 2435", "Service ID 42425"],
      "Application ID 104": ["Service ID 133", "Service ID 36355", "Service ID 3655"],
      "Application ID 132": ["Service ID 403", "Service ID 19855", "Service ID 6223"]
    };
    this.tempDep = ["01 Device ID 101", "01 Device ID 102", "01 Device ID 103", "01 Device ID 104", "01 Device ID 105"];


    this.fetchDevicesList();
    // this.fetchVendors();
    // console.log(this.resourcesList);
    // this.fetchApplications();
    // this.onLoadDep();
    this.setRow(0);
    // this.setRow1(0);
    this.resourceLoad();
    this.dependencyLoad();
    // this.timeout();
    //this.tempHighlightApp();
    // console.log(this.getAppDetails("tomcat%20-%20webserver-qa"));
    
  }

  tempHighlightApp(){
    setTimeout(() => { 
    let ele = <HTMLElement>document.querySelector(".iframeDiv.applicationsList > ul.firstUl > li > a");
      ele.click();     
    }, 3000);    
  }

  resourceLoad() {
    if (this.resourcesList) {
      // console.log(this.resourcesList);
      this.fetchAppsList(this.resourcesList[0].device_name);
    } else {
      setTimeout(() => { this.resourceLoad(); }, 2000);
    }
  }

  toggleSubList(eve){
    const hasClass =  eve.srcElement.parentNode.classList.contains("hideSubList");
    
    if(eve.srcElement.parentElement.nodeName != "UL"){
      if(hasClass){
        setTimeout(() => { eve.srcElement.parentNode.classList.remove("hideSubList"); }, 100);
      }else{
        eve.srcElement.parentNode.classList.add("hideSubList");       
      }
    }
    eve.srcElement.parentNode.click();    
  }

  toggleSubListTitles(eve){
    const hasClass =  eve.srcElement.parentNode.classList.contains("hideSubListTitle");
    
    if(eve.srcElement.parentElement.nodeName != "UL"){
      if(hasClass){
        setTimeout(() => { eve.srcElement.parentNode.classList.remove("hideSubListTitle"); }, 100);
      }else{
        eve.srcElement.parentNode.classList.add("hideSubListTitle");       
      }
    }
    eve.srcElement.parentNode.click();    
  }

  dependencyLoad() {
    if (this.ApsList) {
      // console.log("apps coming");
      // this.fetchDepList(this.resourcesList[0].device_name, this.ApsList[0].appcomp_name, null);
    } else {
      setTimeout(() => {
        this.dependencyLoad();
        // console.log("apps inside timeout");
      }, 2000);
      // console.log("apps else nextline");
    }
    // this.fetchDepList(this.resourcesList[0].device_name, this.ApsList[0].appcomp_name);
  }

  public setRow(_index: number) {
    this.selectedIndex = _index;
  }

  public setRow1(_index: number, name:string) {
    // $event.stopPropagation();
    this.selectedIndex1 = name;
    // this.toggleSubList($event);
  }

  public setRow2(name:string) {
    this.selectedIndex2 = name;
    console.log(this.selectedIndex2);
    // this.toggleSubListTitles($event);
  }

  public setRow3(_index: number, $event) {
    this.selectedIndex3 = _index;
    this.toggleSubList($event);
  }

  fetchDevicesList() {
    this.migrateSer.getDevicesList().subscribe(data => {
      this.setResource(data);
      console.log(data);
    }
    );
  }

  setResource(data) {
    this.resourcesList = data;       
  }

  fetchAppsList(item) {  
    this.fetchDepDevToDevices(item);
    this.selectedRes = item;
    this.migrateSer.getApplicationsDetails(item).subscribe(data => {
      this.setApsData(data);
      this.ApsList = data;    
    }
    );  

  }

  fetchDepDevToDevices(item){
    this.migrateSer.getTechDevDepListDev2Dev(item).subscribe(data => {
      // this.setApsData(data);
      this.dev2DepList = data["dependent_devices"];
      // this.ApsList = data;
      console.log(this.dev2DepList);
    });
  }

  fetchDepAppToDevices(item){
    this.migrateSer.getTechDevDepListDev2Dev(item).subscribe(data => {
      // this.setApsData(data);      
      this.dev2AppList = data["dep_devices"];
      console.log(this.dev2AppList);
      // this.ApsList = data;      
    });
  }

  setApsData(data) {
    this.ApsList = data;
    this.appListTreeAry = [];   
    
    this.ApsList.forEach(item => {      
      this.getAppDetails(item.appcomp_name);      
    });  
  }

  getAppDetails(appName:string){    
    this.migrateSer.getAppDep(appName).subscribe(data =>
     { 
      this.checkAppListAryObj = false;

    let tempPair = {
      appName:appName,
      data:data[0]
    }    
    this.parentAppDepTreeList = {};
      
      this.parentAppDepTreeList = {
        name: appName,
        children: []        
      }

    for (let key in data[0]) {
      let dataValue = data[0][key];
      // Use `key` and `value`
      this.appDepTempList = [];
      
      let newDataValue = dataValue.filter(function (el) {
        return el != null && el != "";
      });
            
      if(newDataValue.length > 0){
        if (Array.isArray(newDataValue) && newDataValue.length){
          newDataValue.forEach(element => {
            if(element){           
              this.appDepTempList.push({name: element});
            }
          });
        }      
      }
      this.appDepTreeList = {};
      this.appDepTreeList = 
      {
        name: key,
        children: this.appDepTempList
        
      }
      this.parentAppDepTreeList["children"].push(this.appDepTreeList);
      
    }
  
    this.appListTreeAry.push(this.parentAppDepTreeList);
    this.dataSource.data = this.appListTreeAry;

    // appListTreeAry
    this.appListAryObj.map(item => {     
      if(item.appName == appName){
        this.checkAppListAryObj = true;
      }
    });
    if(this.checkAppListAryObj == false){
      this.appListAryObj.push(tempPair);
    }
    })    
  }

  getDetailsFrmAppListAryObj(appName:string){  

    return this.appListAryObj.map(item => {     
      if(item.appName == appName){
        let sampleAry:Array<any> = [];        
        Object.keys(item.data).forEach((sub)=>{
          sampleAry.push(sub);
        })       
        return sampleAry;
      }      
    });
    
  }
  getValuesByKey(keyVal,appName){
    this.valuesByKey = [];
     this.appListAryObj.map(item => {
      if(item.appName == appName){        
        if(item.data[keyVal]){
          let keyValAry = item.data[keyVal];
          keyValAry.forEach(element => {
            if(element){
              this.valuesByKey.push(element);
            }            
          });                      
        }
      }      
    });
    console.log(this.valuesByKey.length);
    if(this.valuesByKey.length > 0){
      return this.valuesByKey;
    }else{
      return null;
    }
  }

  getValuesLen(subItemTitle, appName){
    console.log(subItemTitle + appName);
    let valAry = this.getValuesByKey(subItemTitle, appName);
    if(valAry.length > 0){
      return 'hasItems';
    }else{
      return '';
    }
  }

  // showFuncitonalDep(node){
  //   document.getElementById("functionalUl").style.display = "none";
  //   console.log(node);
  //   setTimeout(() => {
  //     document.getElementById("functionalUl").style.display = "block";  
  //   }, 1000);    
  // }

  fetchDepList(devName, appName, event) {

    event.preventDefault();
    event.stopPropagation();

    this.selectedApp = appName;   
    this.migrateSer.getDevDep(devName).subscribe(data => {
      this.devDepList = data;
      this.appCompData = data[0].appcomp_data;
      this.devServiceData = data[0].service_data;
      this.devSoftData = data[0].software_data;
    }
    )

    this.migrateSer.getTechDevDepListDev2Dev(appName).subscribe(data => {
      this.appDepList = data;
      this.dependentOn = data[0].dependent;
      this.dependsOn = data[0].depends_on;
      this.appServiceData = data[0].service_data;
      this.appSoftData = data[0].software_data; 
    }
    )
  }


  shortListApps(item) {
    this.ApsList.forEach(dep => {
      if (dep.name == item) {
        this.DepList = dep.dep;
      }
    });
  }

  onClickMainNode(nodeName){
    console.log(nodeName);
    this.appListTreeAry.forEach((element, index) => {
      console.log(element.name);
      if(this.selectedIndex1 != element.name){
        // this.selectedIndex1 = '';
        this.setRow2(null);
        // this.app2DepListHighlighter(null);
        // this.subApp2DepListHighlighter(null);
        // this.highlightDependency(null);
      }
      if(element.name == nodeName){
        this.setRow1(index, element.name);
      }

      
    });
    // this.setRow1(_index);
    this.migrateSer.getTechDevDepListApp2Dev(nodeName).subscribe(data => {
      this.depListhighlighter["app2DepList"] = [];
      this.app2DepList = data["dep_devices"];
      console.log(this.app2DepList);

      this.dev2DepList.forEach((element, index) => {
        if(this.app2DepList.includes(element)){
          console.log(index);
          console.log(element);
          this.depListhighlighter["app2DepList"].push(index);        
        }
      });
      
    }
    );
  }

  highlightDependency(item){
    let highlighter = [];
    // console.log(item);

    if(this.app2DepList){
      // console.log(this.app2DepListHighlighter(item));
      if(this.app2DepListHighlighter(item)){
        highlighter.push(this.app2DepListHighlighter(item));
      }
    }
    
    if(this.subApp2DepList){
      // console.log(this.subApp2DepListHighlighter(item));
      if(this.subApp2DepListHighlighter(item)){
        highlighter.push(this.subApp2DepListHighlighter(item));
      }
    }
    
    // console.log(highlighter);

    return highlighter;
    
  }

  app2DepListHighlighter(item){
    if(item){
      if(this.app2DepList.includes(item)){
        return 'hasApp2Dep';
      }else{
        return false;
      }  
    }else{
      return false;
    }
    
  }

  subApp2DepListHighlighter(item){
    if(item){
      if(this.subApp2DepList.includes(item)){
        return 'hasSubApp2Dep';
      }else{
        return false;
      }  
    }else{
      return false;
    }
    
  }

  onClickSubNode(nodeName){
    // console.log(nodeName);
    const nodeNameAry = nodeName.split("-");
    // console.log(this.appListTreeAry);
    this.appListTreeAry.forEach((element, index) => {
      // console.log(element.name);
      let eleAry = this.appListTreeAry[index]["children"];
      eleAry.forEach((subEle, subIndex) => {
        // console.log(subEle);
        let eleSubAry = subEle["children"];
        if(eleSubAry.length > 0){
          eleSubAry.forEach(subSubEle => {
            // console.log(subSubEle);
            if(subSubEle.name == nodeName){
              this.onClickMainNode(element.name);
              this.setRow2(subSubEle.name);
              this.setRow1(index, element.name);              
            }
          });
        }       
        
      });

     
    });

    // console.log(nodeNameAry[nodeNameAry.length-1]);
    this.migrateSer.getTechDevDepListApp2DevSubItem(nodeNameAry[nodeNameAry.length-1]).subscribe(data => {
      // console.log(data);
      this.depListhighlighter["subApp2DepList"] = [];
      this.subApp2DepList = data["dep_devices"];;
      // console.log(this.subApp2DepList);
      this.dev2DepList.forEach((element, index) => {
        if(this.subApp2DepList.includes(element)){
          // console.log(index);
          // console.log(element);
          this.depListhighlighter["subApp2DepList"].push(index);        
        }
      });
    }
    );
  }

  setVendors(data: any) {
    this.vendorsList = data.vendors;
  }

  fetchApplications(param) {
    this.migrateSer.getApplicationsDetails(param).subscribe(data => {
      // console.log(data);
      this.setApps(data);
    }
    );
  }

  setApps(data: any) {
    this.applicationList = data;
  }


}
