import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Role } from "./dto/role.model";
import { Injectable } from "@angular/core";

@Injectable()
export class UserService {

    serviceBase:String = '/role';

    constructor(private config:ConfigService,private http:HttpClient){
    
    }

    public  async getRoles() : Promise<Role[]> { 
        var roles:Role[] = [];

        var roleString = localStorage.getItem("roles");
        if(roleString&&roleString!=null){
            roles = JSON.parse(roleString);
        }else {
        
      await  this.http.get(this.config.getAppUrl().concat(this.serviceBase.concat('/mine'))).toPromise().then((data:any) => {
        if(data['statusCode']=='200'){
            roles = data['data'];
        localStorage.setItem('roles',JSON.stringify(roles));
    }
    });
}
        return roles;
    }
}