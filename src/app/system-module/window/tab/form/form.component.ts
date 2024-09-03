import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ConfirmationService, PrimeNGConfig} from 'primeng/api';
import { Column } from '../../../services/dto/Column.model';
import { SystemWindow } from '../../../services/dto/systemwindow.model';

import { GenericService } from '../../../services/generic.service';
import { Tab } from '../../../services/dto/tab.model';
import { FormGroup } from '@angular/forms';
import { TableFunction } from 'src/app/system-module/services/dto/tableDomain.model';
import { Field } from 'src/app/system-module/services/dto/field.model';
import { ConfigService } from 'src/app/system-module/services/config.service';
import { Process } from 'src/app/system-module/services/dto/process.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UtileService } from 'src/app/system-module/services/util.service';
import { ProcessService } from 'src/app/system-module/services/process.service';

@Component({
  selector: 'sys-window-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers:[ConfirmationService]
})
export class FormComponent implements OnInit {

  @Input()
  tab:Tab;

  @Output()
  tabChange = new EventEmitter();
  
  @Input()
  columns:Field[] = [];

  @Input()
  currentRow:any = {};

  @Output()
  currentRowChange = new EventEmitter();
  @Output() tabMode = new EventEmitter();

  @Input()
  formView:boolean = false;

  @Output()
  formViewChange = new EventEmitter();
  @Input()
  detailsView:boolean = false;

  @Output()
  detailsViewChange = new EventEmitter();
  @Input()
  window:SystemWindow;

  @Output()
  windowChange= new EventEmitter();
  @Input()
  isMasterTab:boolean = false;
  
  tempCurrentRow:any = {};


 activeProcess:Process;


  errorMsg:String;
  showError:boolean = false;
  isUpdate:boolean;

  windowid:number;
  editForm:FormGroup;
  constructor(private confirmationService: ConfirmationService,private utileService:UtileService,private route: ActivatedRoute,private router: Router,private primengConfig: PrimeNGConfig,private genericService:GenericService,private configService:ConfigService,private processService:ProcessService) { }


  listTypeModelChange($event){
    var column = $event['column'];
    var value = $event['value'];
    if(column==null||value==null)
    return;
    if(column['columnType'].name=='LIST')
    this.tempCurrentRow[column['columnName']] = value==null?null:value['value'];
  else if(column['columnType'].name=='TABLEDIRECT')
  this.tempCurrentRow[column['columnName']] = value==null?null:value['id'];
else if(column['columnType'].name=='TABLE'){
  if(column['tableObjectDomain']){
    var  map = new Map();
    map.set(column['tableColumnDomain'],value==null?null:value['id']);
    this.tempCurrentRow[column['tableObjectDomain']] = map;
  }else {
    this.tempCurrentRow[column['columnName']] = value==null?null:value['id'];
  }
}

  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
     this.windowid = this.route.snapshot.paramMap.get('windowid') as any;


    if(this.currentRow &&Object.keys(this.currentRow).length==0){
    this.tab.formFields.forEach(field =>{
        if(field.column.columnType.name=='TABLE'){
          this.tempCurrentRow[field.column.tableObjectDomain] = {};
        }

    });}
  }

  async onSubmit(values:any){
    this.toolbarAction('loading');
    let self = this;
    self.tab.formFields.forEach((field)=>{
      if(field.column.columnType.name=='TABLE'){
        var feldPa:Map<string,any> = values[field.column.tableObjectDomain]; 
        if(!feldPa)
        return;
        if(feldPa&&feldPa.size==0){  
        values[field.column.tableObjectDomain] = null;
      }else{
        values[field.column.tableObjectDomain] = feldPa;
      }
      }

    });
    console.log('onSubmit',values);
    if(!self.currentRow ||self.currentRow==null){
    if(!self.isMasterTab&&self.tab.Parent_Tab_Id > 0 && self.tab.column!=null){
      var parentValue;
      self.window.tabs.forEach((value:any)=>{
        if(self.tab.Parent_Tab_Id==value.id){
          if(self.tab.column.columnName.toLocaleLowerCase()==(value.table.name+"_Id").toLocaleLowerCase() )
          parentValue = value.currentRow['id'];
        else if(self.tab.column.columnType.name=='TABLE') {
          parentValue = value.currentRow[this.tab.column.tableColumnDomain];
        }
          else
          parentValue = value.currentRow[this.tab.column.columnName];

          console.log('value',value);
          console.log(self.tab.column.columnName);
          values[self.tab.column.columnName] = parentValue;
          if(self.tab.column.columnType.name=='TABLE'){
            values[self.tab.column.tableObjectDomain]={};
            
            values[self.tab.column.tableObjectDomain][self.tab.column.tableColumnDomain] = parentValue;
          }
        }
      });
    }
  }

  //const findOneFunction = this.tab.table.tableFunctions.find((res)=>{return res.name.toLocaleLowerCase()=="findone";});



  console.log('before send',values);

    if(self.isUpdate){
      
      let  updateFunction = self.tab.table.tableFunctions.find((res)=>{return res.name.toLocaleLowerCase()=="update";}) as TableFunction;
      if(updateFunction==null){
        self.showError = true;
        self.errorMsg = 'Update Function Not Defined ';
        self.toolbarAction('end-loading');
        return;
      }
      var url = self.tab.table.domain.concat(updateFunction.domainPath);
      if(  url.indexOf("{") > 0){
          url = self.utileService.replaceUrlExpression(url,values);
      }
      if(self.tab.table.type=='SYSTEM') {
        url = self.configService.getAppUrl()+'/'+url;
      }
      
      if(updateFunction.domainMethodType.name=='POST'){
       
        await self.genericService.save(url,values).then((data) =>{
        if(data==null){
          self.showError = true;
          self.errorMsg = 'UnExpected Exception Occured ';
                  self.toolbarAction('end-loading');

          return;
        }
          if(data['error']!=null){
            self.showError = true;
            self.errorMsg = data['error'];
            self.toolbarAction('end-loading');

          return;
        }
        if(data['data']){
          self.currentRow = data['data'];
      }
         else {
          self.currentRow = data;
      }
      self.tab.currentRow = self.currentRow;
      self.toolbarAction('end-loading');
      self.cancelForm();
      }).catch((e)=>{
        self.toolbarAction('end-loading');

        self.handleHttpError(e);
      });
    } else if(updateFunction.domainMethodType.name=='PUT') {
 

     
      
    await  self.genericService.put(url,values).then((data) =>{
        if(data==null){
          self.showError = true;
          self.errorMsg = 'UnExpected Exception Occured ';
          self.toolbarAction('end-loading');

          return;
        }
        if(data['error']!=null){
          self.showError = true;
          self.errorMsg = data['error'];
          self.toolbarAction('end-loading');

          return;
        }
        if(data['data']){
          self.currentRow = data['data'];
        }
           else {
            self.currentRow = data;
        }
        self.tab.currentRow = self.currentRow;
        self.toolbarAction('end-loading');

        self.cancelForm();
      }).catch((error)=>{
        self.handleHttpError(error);
        return;
      });
    }

    }else{
      let  createFunction = self.tab.table.tableFunctions.find((res)=>{return res.name.toLocaleLowerCase()=="create";}) as TableFunction;
      if(createFunction==null){
        self.showError = true;
        self.errorMsg = 'Update Function Not Defined ';
        self.toolbarAction('end-loading');

        return;
      }
      var url = self.tab.table.domain.concat(createFunction.domainPath);
      if(url.indexOf("{") > 0){
        url = self.utileService.replaceUrlExpression(url,values);
    }
    if(self.tab.table.type=='SYSTEM') {
      url = self.configService.getAppUrl()+'/'+url;
    }
  
   await  self.genericService.save(url,values).then((data) =>{
      if(data==null){
        self.showError = true;
        self.errorMsg = 'Error Saving Record ';
        self.toolbarAction('end-loading');

      return;
      }
     
      if(data['errorMsg']!=null){
        self.showError = true;
        self.errorMsg = data['errorMsg'];
        self.toolbarAction('end-loading');

        return;
      }
      if(data['error']!=null){
        self.showError = true;
        self.errorMsg = data['error'];
        self.toolbarAction('end-loading');

        return;
      }
      if(data['data']){
        self.currentRow = data['data'];
      }
         else {
          self.currentRow = data;
      }
      self.tab.currentRow = self.currentRow;
      self.toolbarAction('end-loading');

      self.cancelForm();
    }).catch((error)=>{
      self.handleHttpError(error);
      return;
    });
  }

  }

  toolbarAction(action:string){
    if(action=='add'){
      this.formView = true;
      this.currentRow = null;
      this.detailsView = false;
    }else if(action=='edit'){
      this.formView = true;
      this.detailsView = false;
      this.tempCurrentRow = this.currentRow;
      this.isUpdate = true;
    }
    else if (action=='grid'){
      if(this.isMasterTab){
        this.router.navigateByUrl("/system/window/"+this.windowid);
      }
      this.currentRow = null;
      this.tab.currentRow = null;
      this.tabMode.emit('grid');
    }else if (action=='delete'){
      this.confirmDelete();
    }else if(action=='loading' || action=='end-loading') {
      this.tabMode.emit('loading');
    }
  }

  cancelForm(){
    this.tempCurrentRow = {};
    this.isUpdate = false;
    if(this.currentRow==null){
      this.toolbarAction('grid');
    }else{
    this.formView = false;
    this.detailsView = true;
    }
  }
  

   confirmDelete()  {
    let self = this;
    self.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: async () => {
          let  deleteFunction = self.tab.table.tableFunctions.find((res)=>{return res.name.toLocaleLowerCase()=="delete";}) as TableFunction;
          var url;
           url = self.tab.table.domain.concat(deleteFunction.domainPath);

           if(self.tab.table.type=='SYSTEM'){
            url = self.configService.getAppUrl()+"/"+url;
           }
      if( url.indexOf("{") > 0){
          url = self.utileService.replaceUrlExpression(url,this.currentRow);
      }
        await  self.genericService.delete(url).then(()=>{
          self.cancelForm();
          self.toolbarAction('grid');
        }).catch((err)=>{
          self.showError = true;
          self.handleHttpError(err);
        });
     
        }
    });
}


handleProcess(process:Process)  {
  this.activeProcess = process;
  this.showDialog();
}
closeActiveProcess(){
  console.log("activeProcess Closed");
  this.activeProcess = null;
  this.visible = false;
  this.processSubmitButton=true;
  this.activProcessError = null;
  this.activeProcessSuccess = false;
}

  addFieldMappingToCurrentRow(domain:string){
    if(!this.tempCurrentRow[domain]) this.tempCurrentRow[domain]= {};
  }
  getDomainFromColumnName(columnName:String){
    var domain =  columnName.replace('Parent_','').replace('parent_','').replace('App_','').replace('app_','').replace('sec_','').replace('Sec_','').replace('SYSD_','').replace('sysd_','').replace('_Id','').replace('_ID','').toLowerCase().replace('_id','').replace('_','');
    return domain;
  }




  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }


  validateDisplay(field:Field):boolean{
    if(field.displayLogic==null)
    return true;
  else{
      if(field.displayLogic.indexOf('#parent') > -1){
        var parentTab:Tab = this.window.tabs.filter((tb)=>{tb.id==this.tab.Parent_Tab_Id})[0] ;
        return this.utileService.validateMultipleConditions(this.utileService.systemExpression(field.displayLogic,this.currentRow,parentTab.currentRow));
      }else
    return this.utileService.validateMultipleConditions(this.utileService.systemExpression(field.displayLogic,this.currentRow,null));
  }
  }

  processSubmitButton:boolean=true;
  activProcessError:string;
  activeProcessSuccess:boolean;
  async sudmitProcess(){
    this.processSubmitButton = false;
   await  this.processService.submitProcess(this.activeProcess,2,this.currentRow).toPromise().then((data)=>{
      if(data !=null)
      this.activeProcessSuccess=true; 
    else 
    this.activProcessError='process failed';
    }).catch((error)=>{
      this.activProcessError='process failed';

    });
  }
  closeActiveProcessAfterSuccess(){
    this.closeActiveProcess();
    let recordid = this.route.snapshot.paramMap.get('recordid') as any;

    if(recordid ==null)
    this.router.navigateByUrl("/system/window/"+this.windowid+"/"+this.currentRow['id']); 
  else 
  location.href = location.href;   
  }



  handleHttpError(error){
      let self = this;
    if(error['status']=='500')
    self.errorMsg = error['status'] + ' : '+error['error']['error'];
    else
    self.errorMsg = error['status'] + ' : '+error['statusText'];
}

  generateFilterMap(filter , values) :{}{
    if(filter){
      if(filter.indexOf('#parent') > -1) {
      var parentTab:Tab = this.window.tabs.filter((tb)=>{return tb.id==this.tab.Parent_Tab_Id})[0] ;
      filter = this.utileService.systemExpression(filter,values,parentTab.currentRow);
      }else
      filter = this.utileService.systemExpression(filter,values,null);
    var filterList = filter.split(',')
    var filterMap:{} = {};
    for(let cond of filterList){
      var condSplits = cond.split('=');
      filterMap[condSplits[0]] = condSplits[1]
    }
    return filterMap;
  }
  return null;
  }


}
