import { ColumnType } from "./columntype.model";
import { DataSourceFunction } from "./datasource-function.model";
import { DataSource } from "./datasource.model";

export interface Param {
    created: Date;
    createdBy: number;
    updated: Date;
    updatedBy: number;
    name: string;
    name_ar: string;
    displayLogic: string;
    readOnlyLogic: string;
    displayOrder: number;
    columnType: ColumnType;
    columnName: string;
    SYSD_ColumnType_Id: number;
    SYSD_Process_Id: number;
    isReadOnly: boolean;
    isActive: boolean;
    isFrontMap: boolean;
    isDisplayed: boolean;
    description: string;
    id: number;
  

}