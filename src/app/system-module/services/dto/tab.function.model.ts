import { TableFunction } from "./tableDomain.model";

export interface TabFunction {
    name: string;
    description: string;
    tableFunctions:TableFunction;
    id: number;
}