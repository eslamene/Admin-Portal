import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Injectable } from "@angular/core";
import { Individual } from "./dto/individual.model";

@Injectable()
export class IndividualService {



    constructor(private config: ConfigService, private http: HttpClient) {
    }


    public findIndividualByBusinessId(businessId) :Promise<any>{
        var url = this.config.getGatewayAppUrl().concat('/secure/e-wallet/api/individual/findByBusiness/'+businessId);
            return this.http.get(url).toPromise();
    }



}