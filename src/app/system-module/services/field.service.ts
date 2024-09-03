import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Menu } from "./dto/menu.model";
import { Field } from "./dto/field.model";

@Injectable()
export class FieldService {
    serviceBase:String = '/field';

constructor(private config:ConfigService,private http:HttpClient){

}

    public  async getFieldsByTab(id) : Promise<Field[]> { 
        var fields:Field[] = [];


        
      await  this.http.get(this.config.getAppUrl().concat(this.serviceBase.concat('/fetchByTab/'+id))).toPromise().then((data:any) => {
        if(data['statusCode']=='200'){
            fields = data['data'];
    }
    });

        return fields;
    }


    public async save(object:any): Promise<any> {
        return await this.http.post(this.config.getAppUrl().concat(this.serviceBase.concat('/save')),object).toPromise();
    }

}