import { Component, OnInit } from "@angular/core";
import { MessageService } from 'primeng/api';
import { ProcessService } from "../services/process.service";
import { Process } from "../services/dto/process.model";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'sys-process',
    templateUrl: './process.component.html',
    styleUrls: ['./process.component.scss'],
    providers:[MessageService]
  })
  export class ProcessComponent implements OnInit {
    rows:Map<String,Object>[];
    columns:any[];
    processId:number=  0;
    errorMsg:string;
    process:Process;
    paramValues:any;
    constructor(private route: ActivatedRoute, private router: Router,private processService:ProcessService){
        
    }

    ngOnInit(): void {
         this.processId = Number.parseInt(this.route.snapshot.paramMap.get('processid'));

        this.processService.getProcessById(this.processId).then((processb)=>{
            this.process = processb;
        });
    }

    onSubmit(params){
        this.processService.processReport(this.processId,params).then((data)=>{
            this.rows = data;
            if(this.rows!=null && this.rows.length > 0)
            this.columns = Object.keys(data[0]);
        });
    }
  }