import { TableFunction } from "./tableDomain.model";

export interface Table {
    created: Date;
    createdBy: number;
    updated: Date;
    updatedBy: number;
    name: string;
    description: string;
    domain: string;
    tableFunctions:TableFunction[];
    id: number;
    type:string;

}