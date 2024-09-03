export interface Menu {
     created: Date;
     createdBy: number;
     updated: Date;
     updatedBy: number;
     icon:String;
     name: string;
     name_ar: string;
     displayLogic: string;
     readOnlyLogic: string;
     SYSD_Window_Id: number;
     SYSD_Process_Id: number;
     Parent_SYSD_Menu_id: number;
     isWindow: boolean;
     isReport: boolean;
     isReadOnly: boolean;
     isActive: boolean;
     isModule: boolean;
     isFrontMap: boolean;
     description: string;
     id: number;
     childMenus:Menu[];
     routePath:string;


}