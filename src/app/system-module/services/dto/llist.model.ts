import { ListElement } from "./llist.element.model";

export interface ListType {
    created: Date;
    createdBy: number;
    updated: Date;
    updatedBy: number;
    name: string;
    value: string;
    description?: any;
    id: number;
    elements:ListElement[];
}