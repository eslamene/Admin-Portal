import { Column } from "./Column.model";
import { Field } from "./field.model";
import { TabFunction } from "./tab.function.model";
import { Table } from "./table.model";

export interface Tab {
     created: Date;
     createdBy: number;
     updated: Date;
     updatedBy: number;
     name: string;
     name_ar: string;
     displayLogic: string;
     readOnlyLogic: string;
     formFields: Field[];
     detailFields: Field[];
     gridFields: Field[];
     displayedFields: Field[];
     column:Column;
     table:Table;
     sqlWhere: string;
     Parent_Tab_Id:number;
     currentRow:any;
     id:number;
     isAllowInsert:boolean;
     isAllowDelete:boolean;   
     isAllowUpdate:boolean;
     tabFunctions:TabFunction[];
}