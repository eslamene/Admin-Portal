import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { SystemWindow } from "./dto/systemwindow.model";

@Injectable()
export class WindowService {
    private serviceBase: String = '/window';

    constructor(private config: ConfigService, private _http: HttpClient) {
    }

    public async getWindowById(windowId: number): Promise<any> {
        return await  this._http.get(this.config.getAppUrl().concat(this.serviceBase.concat('/findbyid/').concat(windowId.toString())))
            .toPromise();

    }




    public async initializeWindow(windowId: number): Promise<SystemWindow> {
        var windowStorage = localStorage.getItem("Window#".concat(windowId.toString()));
        let window = {} as  SystemWindow;
        if (windowStorage != null) {
            window = JSON.parse(windowStorage);
        }

        if (window == null) {
            await this.getWindowById(windowId).then((res) => {
                window = res;
                localStorage.setItem("Window#".concat(window.id.toString()),JSON.stringify(window));
            }, (error) => { });
        }

        return window;
    }

}