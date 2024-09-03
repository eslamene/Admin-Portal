import { Component, OnInit } from "@angular/core";
import { KYCService } from "../services/kyc.service";
import { IndividualService } from "../services/individual.service";

@Component({
    selector: 'kyc-dashboard',
    templateUrl: './dashboard.html',
    styleUrls: ['./dashboard.scss']
  })
  export class KYCDashboard implements OnInit {

    dashboard:[][];

    constructor(private kYCService: KYCService,private individualService:IndividualService) {

    }

    ngOnInit(): void {

    this.kYCService.fetchDashboard().then((data)=>{
        this.dashboard = data['result'];
    });
    }


    getRow(mainIndex:number,index: number): string {
        return this.dashboard[mainIndex][index];
      }

  }