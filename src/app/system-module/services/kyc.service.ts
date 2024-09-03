import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Injectable } from "@angular/core";
import { Individual } from "./dto/individual.model";

@Injectable()
export class KYCService {


    constructor(private config: ConfigService, private http: HttpClient) {
    }

    public processKYCWithNationalId(front:string,back:string,businessId:string) :Promise<any>{
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/kyc/national-identification/create");
        var request = {"request": {"data":{"front_img":front,"back_img":back}}, "signature":"","business_id":businessId};    
        return this.http.post(url,request).toPromise();
    }

    public findallPendingKYC() :Promise<any>{
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/view/pending");
        return this.http.get(url).toPromise();
    }
    public findallKycHistory(id) :Promise<any>{
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/history/"+id);
        return this.http.get(url).toPromise();
    }
    
    public fetchResult(businessId) :Promise<any>{
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/fetchResult/"+businessId);
        return this.http.get(url).toPromise();
    }

    public fetchDashboard() :Promise<any>{
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/dashboard");
        return this.http.get(url).toPromise();
    }

    public updateOCRData(businessId,request) :Promise<any>{
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/"+businessId);
        return this.http.put(url,request).toPromise();
    }


    public confirmData(businessId){
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/confirmOcr/"+businessId);
        return this.http.get(url).toPromise();
    }


    public reject(businessId){
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/reject/"+businessId);
        return this.http.get(url).toPromise();
    }

    public updateSatus(businessId,Status){
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/updatestatus/"+businessId+"/"+Status);
        return this.http.get(url).toPromise();
    }

    public approve(businessId){
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/kyc/v1/api/info/approve/"+businessId);
        return this.http.get(url).toPromise();
    }

    public requestCard(request){
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/cms/card/request-kit");
       // var url = this.config.getKycSeviceURL().concat("/card/request-kit");
        return this.http.post(url,request).toPromise();
    }

    public fetchCardDetails(businessId){
        
        var request = {"request":{"businessReference":businessId},signature:"Empty"};
        var url = this.config.getGatewayAppUrl().concat("/secure/channel/cms/card/details");
       // var url = this.config.getKycSeviceURL().concat("/card/request-kit");
        return this.http.post(url,request).toPromise();
    }

   

}