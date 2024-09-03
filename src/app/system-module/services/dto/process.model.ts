import { DataSourceFunction } from "./datasource-function.model";
import { DataSource } from "./datasource.model";
import { Param } from "./param.model";

export interface Process {
    created: Date;
    createdBy: number;
    updated: Date;
    updatedBy: number;
    name: string;
    name_ar: string;
    displayLogic:string;
    readOnlyLogic: string;
    displayOrder: number;
    params: Param[];
    viewname: string;
    className: string;
    isReport: boolean;
    isReadOnly: boolean;
    isActive: boolean;
    isFrontMap: boolean;
    isDisplayed: boolean;
    description: string;
    id: number;
    dataSource:DataSource;
    dataSourceFunction:DataSourceFunction;
}