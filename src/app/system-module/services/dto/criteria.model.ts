import { ListElement } from "./llist.element.model";

export class Criteria {
    page: number = 0;
    size :number = 10;
    sort_by:string;
    sort_direction :string;
}