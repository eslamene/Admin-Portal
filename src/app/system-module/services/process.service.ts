import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Process } from './dto/process.model';
import { UtileService } from './util.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  serviceBase: string = "/process";

  constructor(private config: ConfigService,private utilService:UtileService, private http: HttpClient) { }

  public async getProcessById(processId: number): Promise<Process> {
    var proces: Process  ;
    await this.http.get(this.config.getAppUrl().concat(this.serviceBase.concat('/findbyid/').concat(processId.toString())))
      .toPromise().then((response:any) => {
        proces = response['data'];
      }, (error) => {
        console.log(error);
      });

    return proces;
  }


  public async processReport(processId: number,params:any): Promise<any> {
    var proces: any = null;

    await this.http.post(this.config.getAppUrl().concat(this.serviceBase.concat('/generate-report/').concat(processId.toString())),params)
      .toPromise().then((response:any) => {
        proces = response['data'];
      }, (error) => {
        console.log(error);
      });

    return proces;
  }


  submitProcess(process:Process,recordid:any,context:{}) : Observable<any>{
    var url: string;
    url = process.dataSource.domain.concat(process.dataSourceFunction.domainPath);
    url = this.utilService.replaceUrlExpression(url,context);

      if(process.dataSourceFunction.domainMethodType.name=="GET"){
      return this.http.get(url);
      }else {
        context['Record_Id'] = recordid;
      return this.http.post(url,context);
      }
}

}
