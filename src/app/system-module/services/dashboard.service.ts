import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  serviceBase: string = '/dashboard';

  constructor(private config: ConfigService, private http: HttpClient) {

  }



  public async getDashboard(): Promise<any> {
    var dashboard: any;
    await this.http.get(this.config.getAppUrl().concat(this.serviceBase)).toPromise().then((data) => {
      if (data['statusCode'] == '200')
        dashboard = JSON.parse(data['data']);
    });
    return dashboard;
  }



  public async getDashboardDetail(type: string): Promise<any> {
    var dashboard: any;
    await this.http.get(this.config.getAppUrl().concat(this.serviceBase).concat("/").concat(type)).toPromise().then((data) => {
      if (data['statusCode'] == '200')
        dashboard = JSON.parse(data['data']);
    });
    return dashboard;
  }





}
