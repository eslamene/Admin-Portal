import { DataSourceFunctionGroup } from "./datasource-function-group.model";
import { DataSourceFunction } from "./datasource-function.model";
import { DataSource } from "./datasource.model";


    export interface DomainMethodType {
        name: string;
        description?: any;
        id: number;
    }

    export interface TableFunction {
        id: number;
        name: string;
        name_ar?: any;
        description?: any;
        description_ar?: any;
        domainPath: string;
        SYSD_Domain_MethodType_Id: number;
        SYSD_Table_Id: number;
        domainMethodType: DomainMethodType;
        dataSource:DataSource;
        dataSourceFunctionGroup:DataSourceFunctionGroup;
        dataSourceFunction:DataSourceFunction;
    }

    export interface TableDomainModel {
        tableFunctions: TableFunction[];
        domain: string;
    }



