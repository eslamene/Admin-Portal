import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Menu } from "./dto/menu.model";

@Injectable()
export class MenuService {
    serviceBase:String = '/menu';

constructor(private config:ConfigService,private http:HttpClient){

}

    public  async getMenu() : Promise<Menu[]> { 
        var menus:Menu[] = [];

        var menuString = localStorage.getItem("menus");
        if(menuString&&menuString!=null){
            menus = JSON.parse(menuString);
        }else {
        
      await  this.http.get(this.config.getAppUrl().concat(this.serviceBase.concat('/findMenus'))).toPromise().then((data:any) => {
        if(data['statusCode']=='200'){
        menus = data['data'];
        localStorage.setItem('menus',JSON.stringify(menus));
    }
    });
}
        return menus;
    }


}