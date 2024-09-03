import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LazyLoadEvent, Message } from 'primeng/api';
import { Tab } from 'src/app/system-module/services/dto/tab.model';
import { FileService } from 'src/app/system-module/services/file.service';
import { GenericService } from 'src/app/system-module/services/generic.service';
import { Criteria } from 'src/app/system-module/services/dto/criteria.model';
import { Table } from 'primeng/table/table';
import { Column } from 'src/app/system-module/services/dto/Column.model';
import { SystemWindow } from 'src/app/system-module/services/dto/systemwindow.model';
import { TableFunction } from 'src/app/system-module/services/dto/tableDomain.model';
import { Field } from 'src/app/system-module/services/dto/field.model';
import { UtileService } from 'src/app/system-module/services/util.service';

@Component({
  selector: 'sys-window-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input()
  tab:Tab;

  @Output()
  tabChange = new EventEmitter();

  @Input()
  window:SystemWindow;

  @Output()
  windowChange  = new EventEmitter();

  @Input()
  isMasterTab:boolean = false;

  rows:Map<String,Object>[];
  temp:Map<String,Object>[];

  @Input()
  columns:Field[] = [];
  @Output() tabMode = new EventEmitter();

  ColumnMap : Map<string,{title:string,type:string}>;
  loadedData:boolean = false;
  exportBtnLabel: string = 'Export Data';
  newRecord : string = "New Record";
  settings = {
    actions: false,
    columns: {
    },
  };

  error:Message[];
  pageSize:number = 100;
  totalRecords:number = 50;
  constructor(private genericService:GenericService,private utileService:UtileService,private fileService:FileService) { }

  async ngOnInit() {
    this.tabMode.emit('loading');

    await this.loadRows(0,100);
        this.tabMode.emit('loading');

    this.temp = this.rows;

    this.ColumnMap = new Map<string,{title:string,type:string}>();
    this.columns.forEach((col:any)=>{
      this.ColumnMap.set(col.name,{'title':col.name,'type':'string'}) ;
    });
    this.settings['columns'] = this.ColumnMap;
    this.loadedData = true;
    console.log(this.ColumnMap);
  }


    async loadRows(page:number,size:number){
      
      let self = this;
      if(!self.isMasterTab && self.tab.column!=null){
        var mp = new Map<String,Object>();
        var parentVallue ;
        
        self.window.tabs.forEach((value:any)=>{
          if(value.id == self.tab.Parent_Tab_Id){
            if((self.tab.column.columnName).toLowerCase()==(value.table.name+"_Id").toLowerCase())
            parentVallue  = value.currentRow['id'];
            else
            parentVallue  = value.currentRow[self.tab.column.columnName];

            if(this.tab.table.type=='API'){
              parentVallue = value.currentRow[self.tab.column.tableColumnDomain];
            }

            return;
          }
        });
  
        if(!parentVallue)
        parentVallue = 0;
  
        mp[this.tab.column.columnName]= parentVallue;
        
        if(this.tab.table.type=='SYSTEM'){
        this.rows = await this.genericService.findByParams(this.tab.table.domain , mp,page,size,this.tab.sqlWhere);
  
      }

        if(this.tab.table.type=='API'){
          
          let  findByParams = this.tab.table.tableFunctions.find((res)=>{return res.name.toLocaleLowerCase()=="findbyparams";}) as TableFunction;
          
          var params:any = {
            page: 0, size: 100,
            sort_by: 'id',
            sort_direction: 'DESC'
          };
          if(this.tab.column.columnType.name=='TABLE'){
            params[this.tab.column.tableObjectDomain] = {};
            params[this.tab.column.tableObjectDomain][this.tab.column.tableColumnDomain] = parentVallue;

          }
          if(findByParams!=null){
            var url;
            url = self.tab.table.domain.concat(findByParams.domainPath);

            url= self.utileService.replaceUrlExpression(url,parentVallue)

            if(findByParams.domainMethodType.name=='POST')
        this.rows = await this.genericService.findBySearchCriteria(this.tab.table.domain.concat(findByParams.domainPath) , params);
      else if (findByParams.domainMethodType.name=='GET'){
        this.rows = await this.genericService.get(url , null);
      }
      }
          else 
          this.error = [
            { severity: 'error', summary: 'Error', detail: 'Featching Childe Function Not Defined' },
        ];
      }

        if(this.rows&&this.rows.length > 0 && this.rows!=null)
          this.totalRecords =  await this.genericService.findTotalRecords(this.tab.table.domain , mp);
      }else {
        let  findallFunction = self.tab.table.tableFunctions.find((res)=>{return res.name.toLocaleLowerCase()=="findall";}) as TableFunction; 
        if(findallFunction!=null)
        self.rows = await self.genericService.findAll(this.tab.table.domain.concat(findallFunction.domainPath),page,size,this.tab.sqlWhere);

        if(self.rows && self.rows.length > 0 )
        self.totalRecords =  100;//await this.genericService.findTotalRecords(this.tab.table.domain , mp);
      }
    }

  exportFile() {

    var cols: string[] = new Array();

    this.columns.forEach((mp) => { 
      if(!mp['name'].toString().toLowerCase().endsWith("id"))
      cols.push(mp['name']) });


    this.fileService.downloadFile(this.rows, this.tab.name);
  }

  lastClickTime: number = 0;

  rowSelected($event:any,isFromDetail:boolean) {
    if(isFromDetail){
      this.window.tabs.forEach(mp=>{
        if(mp.id==this.tab.id){
        mp.currentRow = $event;
        this.tabMode.emit($event);
      }
      }) ;
      return;
    }
    if (this.lastClickTime === 0) {
      this.lastClickTime = new Date().getTime();

    } else {
      const change = (new Date().getTime()) - this.lastClickTime;
      if (change <= 600) {
        this.window.tabs.forEach(mp=>{
          if(mp.id==this.tab.id){
          mp.currentRow = $event;
          this.tabMode.emit($event);
        }
        }) ;
      }
      this.lastClickTime = 0;
    }
  }



  async loadData(event: any) {
    if(event.first >0){
      await this.loadRows((event.first/event.rows),event.rows);
    }else
    await this.loadRows(0,event.rows);

    console.log(event);
  }

  newRecordMethod(){
    this.tabMode.emit(null);

  }


  clear(table: Table) {
    table.clear();
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

grtTableDirectdomainObject(columnName:string){
  return columnName.replace('_Id','').replace('Parent_','').replace('SYSD_','')}

  onColReorder($event:any){
    console.log($event);
  }

}


