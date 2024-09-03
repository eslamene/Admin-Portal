import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, NgZone, OnInit, Output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, SelectControlValueAccessor } from '@angular/forms';
import { TableDomainModel } from '../services/dto/tableDomain.model';
import { GenericService } from '../services/generic.service';
import { Column } from '../services/dto/Column.model';
import { Field } from '../services/dto/field.model';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers:[{ 
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => InputFieldComponent),
  }]
})
export class InputFieldComponent  extends SelectControlValueAccessor  implements OnInit {

  @Input() typeModel:any ;
  @Output() typeModelChange:EventEmitter<any> = new EventEmitter<any>();

  options:any  = [];

  @Input()
  bindValue:string;
  @Input()
  field:Field;

  @Input() defaultValue : any = 0;

  @Input()
  labelName = 'name';

  @Input()
  filter:{}=null;

  optionLabel = 'name';
  override onChange: (_: any) => void;

  override onTouched: () => void = () => null;

  domainModel:TableDomainModel;
  constructor(private genericService:GenericService,private cdr: ChangeDetectorRef,private ngZone: NgZone,_renderer: Renderer2, _elementRef: ElementRef) {
    
    super(_renderer, _elementRef);
    this.ngOnInit = this.ngOnInit.bind(this);

  }

   async ngOnInit():Promise<void> {

  }
  override value: any;
  override writeValue(value: any): void {
    if (value) {
      this.value.emit(value);
  }

  
  
  }
  
  OpenChange($event:any){
 
    var event = {'value':$event,'column':this.field.column};
        event['column'] = this.field.column;
      
      this.typeModelChange.emit(event);

    }

  SearchChange(b:any){
  return this.options;
  }


  async onShow(){
    var self = this;
    //let this = this;
    var tempColumnName = [];
    if(self.field.column.columnName.toLowerCase().indexOf('sec_user') >= 0)
      self.optionLabel = 'username';


    
    if(self.field.column.tableIndexedColumn!=null&&self.field.column.tableIndexedColumn!='')
      self.optionLabel = self.field.column.tableIndexedColumn;

      if(self.filter){
        if(self.field.column.columnType.name=="TABLE") {
          self.domainModel ={domain:this.field.column.table.domain,tableFunctions:this.field.column.table.tableFunctions};
          const  findallFunction:any  = self.domainModel.tableFunctions.find((res)=>{ return res.name.toLocaleLowerCase()=="findbyparams"});
          self.genericService.findByParams(self.domainModel.domain.concat(findallFunction.domainPath),self.filter,0,0,null).then((res)=>{
            self.options = res;
            if(self.defaultValue > 0)
              self.typeModel = self.defaultValue;
            else 
            self.typeModel=null;
             
          
          }); 
        } else if(self.field.column.columnType.name=="TABLEDIRECT"){
          self.domainModel = await self.genericService.findDomain(self.field.column.columnName.replace('_Id','').replace('Parent_',''));
      
           const  findallFunction:any  = self.domainModel.tableFunctions.find((res)=>{ return res.name.toLocaleLowerCase()=="findbyparams"});
      
           self.options =  await this.genericService.findByParams(self.domainModel.domain,self.filter,0,100,null);
          if(self.defaultValue > 0){
            for(var i=0;i<self.options.length;i++){
             if(self.defaultValue==self.options[i]['id']){
              self.typeModel =self.options[i];
              break;
             }
            }
           }else {
            self.typeModel=null;
           }
        }
      } else {
   if(self.field.column.columnType.name=="TABLE") {
    self.domainModel ={domain:self.field.column.table.domain,tableFunctions:self.field.column.table.tableFunctions};
    const  findallFunction:any  = self.domainModel.tableFunctions.find((res)=>{ return res.name.toLocaleLowerCase()=="findall"});
    self.genericService.findAll(self.domainModel.domain.concat(findallFunction.domainPath),0,0,null).then((res)=>{
      self.options = res;
      if(self.defaultValue > 0)
        self.typeModel = self.defaultValue;
      else 
      self.typeModel=null;
       
    
    }); 
  } else if(self.field.column.columnType.name=="TABLEDIRECT"){
    self.domainModel = await self.genericService.findDomain(self.field.column.columnName.replace('_Id','').replace('Parent_',''));

     const  findallFunction:any  = this.domainModel.tableFunctions.find((res)=>{ return res.name.toLocaleLowerCase()=="findall"});

     self.options =  await this.genericService.findAll(this.domainModel.domain.concat(findallFunction.domainPath),0,0,null);
    if(self.defaultValue > 0){
      for(var i=0;i<self.options.length;i++){
       if(self.defaultValue==self.options[i]['id']){
        self.typeModel =self.options[i];
        break;
       }
      }
     }else {
      self.typeModel=null;
     }
  } else if (self.field.column.columnType.name=="LIST"){
    self.options = self.field.column.list.elements;
  if(self.defaultValue!=null){
    for(var i=0;i<self.options.length;i++){
        if(self.options[i].value==self.defaultValue){
          self.typeModel = self.options[i];
          break;
      }
    }
  }
}
    
}
  }



  onClear(){
    this.OpenChange(0);
  }
}
