import { Tab } from "./tab.model";


export interface SystemWindow {
     created: Date;
     createdBy: number;
     updated: Date;
     updatedBy: number;
     name: string;
     name_ar: string;
     displayLogic: string;
     readOnlyLogic: string;
     tabs: Tab[] ;
     isReadOnly: boolean;
     isActive: boolean;
     isFrontMap: boolean;
     description: string;
     windowType:string;
     id: number;




    
}



