import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Column } from '../../services/dto/Column.model';
import { Tab } from '../../services/dto/tab.model';
import { SystemWindow } from '../../services/dto/systemwindow.model';
import { GenericService } from '../../services/generic.service';
import { TableFunction } from '../../services/dto/tableDomain.model';
import { FieldService } from '../../services/field.service';
import { Field } from '../../services/dto/field.model';
import { UtileService } from '../../services/util.service';


@Component({
  selector: 'sys-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input()
  isGridView:boolean = true;
  @Input()
  isFormView:boolean  = false;
  @Input()
  isDetailView:boolean = false;
  @Input()
  isMasterTab:boolean  = false;
  @Input()
  tab:Tab ;
  @Input()
  recordId:number = 0;

  currentRow:any;
  isReloaded:boolean  = true;
  feildRows:Field[];

  loading:boolean = false;
  tabFieldEdit:boolean = false;
  @Input()
  window:SystemWindow;
  @Output()
  windowChange = new EventEmitter();

  @Output() windowMode = new EventEmitter();


  clonedFields: { [s: string]: Field } = {};

  constructor(private route: ActivatedRoute,private genericService:GenericService, private router: Router,private fieldService:FieldService,private utilService:UtileService) { }

  async ngOnInit() {
    
    this.reload();
    
   
  }
  onRowEditInit(field: Field) {
    this.clonedFields[field.id as number] = { ...field };
}

onRowEditCancel(field: Field, index: number) {
  this.feildRows[index] = this.clonedFields[field.id as number];
  delete this.clonedFields[field.id as number];
}


 async onRowEditSave(field:Field) {

      await this.fieldService.save(field).then((data) => {}).catch((error)=>{
        console.log(error);
      });
            delete this.clonedFields[field.id as number];
         
    }

  async reload(){
    this.router.events.subscribe((val) =>{
      if(val instanceof NavigationStart){
        this.isReloaded = false;

        this.isReloaded = true;
      }
    });
      if(!this.isMasterTab  &&this.tab.currentRow!=null){
      this.currentRow =this.tab.currentRow;
      this.isDetailView = true;
      this.isGridView = false;
      this.isFormView = false;
    }

    if(this.isMasterTab && this.recordId >0&&this.tab.currentRow==null){
      await this.handleCurrentRecord();
    }


    
  }
  async handleCurrentRecord(){
    let self=this;
    var  domain =null;
    let  findOne = this.tab.table.tableFunctions.find((res)=>{return res.name.toLocaleLowerCase()=="findone";}) as TableFunction;
    var url = this.tab.table.domain.concat(findOne.domainPath); 
    url = this.replaceUrlExpression(url,this.recordId);
     await this.genericService.findById(url,this.recordId).then((data)=>{
      self.changeTabMode(data) ;
 
     });
  
  }

  replaceUrlExpression(url,valuesObject){
    console.log(typeof valuesObject);
    if(typeof valuesObject=='string' || typeof valuesObject=='number'){
      var indexOfStartEXP=url.indexOf("{");
      var indexOfEndEXP=url.indexOf("}");
      var expName = url.substring(indexOfStartEXP+1,indexOfEndEXP);
      url = url.replace("{"+expName+"}",valuesObject);
    }
    else {
    while(url.indexOf("{") > 0 ||url.indexOf("}") > 0){
      var indexOfStartEXP=url.indexOf("{");
      var indexOfEndEXP=url.indexOf("}");
      var expName = url.substring(indexOfStartEXP+1,indexOfEndEXP);
      url = url.replace("{"+expName+"}",valuesObject[expName]);
    }
  }
   return  url ;
  }

  changeTabMode(event:any){
    if(event=='loading'){
    this.loading = !this.loading;
  return;
  }
    this.isGridView = false;
    if(event=='grid'){
      this.isGridView = true;
      this.isDetailView = false;
      this.isFormView = false;
      if(this.isMasterTab){
        this.windowMode.emit(0);
      
      }
      return ;
    }else {
    if(event==null){
    this.isDetailView = false;
    this.isFormView = true;
    this.currentRow = null;
    }else {
      this.tab.currentRow = event;
      this.currentRow= event;

      if(this.isMasterTab){
        this.windowMode.emit(event.id);
      }
      this.isDetailView = true;
      this.isFormView = false;
    }
  }
  }

  getGridColumnType(columnSystemType:string){
    if(columnSystemType=='DATE'||columnSystemType=='DATETIME')
    return 'date';
    else if (columnSystemType=='BOOLEAN')
    return 'boolean';
    else if (columnSystemType=='NUMBER'||columnSystemType=='DECIMAL'||columnSystemType=='ID')
    return 'numeric';
    else
    return 'text';
  }

  async tabEditAction(){
    this.feildRows = await this.fieldService.getFieldsByTab(this.tab.id);
    this.tabFieldEdit = true;
  }

  isSystemAdmin():boolean{
    return this.utilService.checkSystemAdminRole();
  }

}
