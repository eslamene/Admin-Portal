import { ColumnType } from "./columntype.model";
import { ListType } from "./llist.model";
import { Process } from "./process.model";
import { Table } from "./table.model";

export interface Column {
     created: Date;
     createdBy: number;
     updated: Date;
     updatedBy: number;
     name: string;
     description: string;
     length: number;
     SYSD_ColumnType_Id: number;
      columnName: string;
     SYSD_Table_Id: number;
     id: number;
     columnType: ColumnType;
     table:Table;
     SYSD_List_Id:number;
     SYSD_Process_Id:number;
     list:ListType;
     tableObjectDomain:string;
     tableColumnDomain:string;
     tableIndexedColumn:string;
     process:Process;
}