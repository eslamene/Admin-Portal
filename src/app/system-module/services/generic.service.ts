import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Criteria } from "./dto/criteria.model";
import { TableDomainModel } from "./dto/tableDomain.model";

@Injectable()
export class GenericService {



    constructor(private config: ConfigService, private http: HttpClient) {

    }


    public async findAll(domain: string, page: number, size: number,where:string | null): Promise<any[]> {
        var objects : any;
        var url = this.config.getAppUrl().
            concat('/').concat(domain);

            if(page > 0 && size > 0){
            url = url.concat('/').concat(page.toString())
                .concat('/').concat(size.toString());
                 }
                if(domain.startsWith("http://")||domain.startsWith("https://"))
                url = domain;

                if(where!=null){
        await this.http.get(url,{headers:{"where":where}}).toPromise().then((data:any) => {
            if (data['statusCode'] == '200')
                objects = data['data'];
        }, (error) => {
            console.log(error);
        });
    }
    else {
        await this.http.get(url,{headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"}}).toPromise().then((data:any) => {
            if(data['statusCode']){
            if (data['statusCode'] == '200')
                objects = data['data'];
        }else {
            objects = data;
        }
        }, (error) => {
            console.log(error);
        });
    }
        return objects;
    }



    public async findById(domain: string,id: any): Promise<any> {
        var objects = {};
        var url;
                if(domain.startsWith("http://")||domain.startsWith("https://")){
                url = domain;
                }else {
                     url = this.config.getAppUrl().
            concat('/').concat(domain.concat('/findbyid')
                .concat('/').concat(id.toString()));
                }

        await this.http.get(url).toPromise().then((data:any) => {
            if (data['statusCode'] == '200')
                objects = data['data'];
        }, (error) => {
            console.log(error);
        });
        return objects;
    }

    public async findDomain(tableName: string): Promise<TableDomainModel> {
        let  objects = {} as TableDomainModel;
        var url =  this.config.getAppUrl()+'/table/domain/'+tableName;

        
        await this.http.get(url).toPromise().then((data:any) => {
                 objects = data['content']?data['content']:data['data']?data['data']:data;

        }, (error) => {
            console.log(error);
        });
        return objects;
    }


    public async findByParams(domain: string,params: any , page :number, size:number,where:string): Promise<any> {
        var objects = {};
        params['page'] = page;
        params['pagesize'] = size;
        var url = this.config.getAppUrl().
            concat('/').concat(domain.concat('/findbyparams'));
            
            if(where !=null){
                
        await this.http.post(url,params,{headers:{"where":where}}).toPromise().then((data:any) => {
            objects = data['content']?data['content']:data['data']?data['data']:data;

        }, (error) => {
            console.log(error);
        });
    }else {
        await this.http.post(url,params).toPromise().then((data:any) => {
            objects = data['content']?data['content']:data['data']?data['data']:data;

        }, (error) => {
            console.log(error);
        });
    }
        return objects;
    }



    public async findBySearchCriteria(domain: string,criteria:Criteria): Promise<any> {
        var objects = {};
      
        var url = this.config.getAppUrl().
            concat('/').concat(domain);
            if(domain.startsWith("http://")||domain.startsWith("https://"))
            url = domain;

            await this.http.post(url,criteria,{headers:{"Content-Type":"application/json"}}).toPromise().then((data:any) => {
                objects = data['content']?data['content']:data['data']?data['data']:data;
            }, (error) => {
                console.log(error);
            });
        return objects;
    }



    public async findTotalRecords(domain: string,params: {}): Promise<any> {
        var objects = 0;
                if(params==null)
                params = {};
                
        var url = this.config.getAppUrl().
            concat('/').concat(domain.concat('/countresults'));

            if(domain.startsWith("http://")||domain.startsWith("https://"))
            url = domain;

        await this.http.post(url,params).toPromise().then((data:any) => {
            objects = data['content']?data['content']:data['data']?data['data']:data;

        }, (error) => {
            console.log(error);
        });
        return objects;
    }


    public async save(url: string,object:any): Promise<any> {
  
       

        return await this.http.post(url,object).toPromise();
    }


    public async post(domain: string,params:any,headers:{}): Promise<any> {

        var objects = 0;
        if(params==null)
        params = {};
        
var url = this.config.getAppUrl().
    concat('/').concat(domain.concat('/countresults'));

    if(domain.startsWith("http://")||domain.startsWith("https://"))
    url = domain;

await this.http.post(url,params).toPromise().then((data:any) => {
    objects = data['content']?data['content']:data['data']?data['data']:data;

}, (error) => {
    console.log(error);
});
return objects;    }

    public async get(domain: string,headers:{}): Promise<any> {
        var objects;
        if(domain.startsWith("http://")||domain.startsWith("https://"))
            domain = domain;
        else
        domain = this.config.getAppUrl()+domain;
        
        await this.http.get(domain).toPromise().then((data:any) => {
                 objects = data['content']?data['content']:data['data']?data['data']:data;

        }, (error) => {
            console.log(error);
        });
        return objects;    }

    public async put(url: string,object:any): Promise<any> {

        return await this.http.put(url,object).toPromise();
    }



    public async delete(url:string) : Promise<any>{

        return await this.http.delete(url).toPromise();
    }


}