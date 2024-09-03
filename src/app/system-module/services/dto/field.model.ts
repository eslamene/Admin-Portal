import { Column } from "./Column.model";

export interface Field {
     created: Date;
     createdBy: number;
     updated: Date;
     updatedBy: number;
     name: string;
     name_ar: string;
     displayLogic: string;
     readOnlyLogic: string;
     column: Column;
     SYSD_Tab_Id: number;
     SYSD_Column_Id: number;
     isReadOnly: boolean;
     isActive: boolean;
     isFrontMap: boolean;
     description: string;
     id: number;
     isGridView:boolean;
     isFormview:boolean;
     isDetailView:boolean;
     isGridFixedField:boolean;
     isRequired:boolean;
     isSortable:boolean;
     isSearchable:boolean;
     regex:string;
     defaultValue:string;
     filter:string;
}