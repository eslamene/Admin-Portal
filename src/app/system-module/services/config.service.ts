import { Injectable } from "@angular/core";

@Injectable()
export class ConfigService{

 //public appUrl:String = 'https://10.0.30.150:9099/not-secure/meta';
  public gateWayAppUrl:String = 'https://10.0.10.25:9099';
  public appUrl:String = this.gateWayAppUrl+'/secure/meta';




    public  getAppUrl(): String {
        return this.appUrl;
    }

    public  getGatewayAppUrl(): String {
        return this.gateWayAppUrl;
    }




   



    
}