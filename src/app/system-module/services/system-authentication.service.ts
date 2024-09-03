import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import * as shajs from 'sha.js';


@Injectable()
export class Authentication {


    constructor(private _config: ConfigService, private _http: HttpClient) {
    }


    async  login(username: string, password: string) : Promise<any>  {
        var newPassword = shajs('sha256').update(password).digest('hex');

    return  this._http.post(this._config.getGatewayAppUrl() + "/auth/login", { "username": username, "password": password }).toPromise();
    
    }


    async  resetPassword( password: string) : Promise<any>  {
        return  this._http.post(this._config.getAppUrl() + "/user/changePassword", {"newPassword": password }).toPromise();
    
        }



}