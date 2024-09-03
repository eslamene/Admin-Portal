import { Component, OnInit } from "@angular/core";
import { ConfirmationService, ConfirmEventType, MenuItem, Message, MessageService } from 'primeng/api';
import { IndividualService } from "../services/individual.service";
import { Individual } from "../services/dto/individual.model";
import { KYCService } from "../services/kyc.service";
import { NIDOCRMOdel } from "../services/dto/nid.ocr.model";
import * as FileSaver from 'file-saver';
import jsPDF from "jspdf";
import { SystemWindow } from "../services/dto/systemwindow.model";
import { WindowService } from "../services/window.service";

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
    selector: 'kyc-window',
    templateUrl: './kyc.html',
    styleUrls: ['./kyc.scss'],
    providers:[MessageService]
  })
  export class KYCComponent implements OnInit {
    uploadedFiles: any[] = [];
    crudPopup:boolean = false;
    crudSteps: MenuItem[] = [];
    reviewKYCSteps: MenuItem[] = [];
    reviewActiveIndex:number=0;
    activeStepIndex:number = 0;
    error:Message[];
    customerMessage:Message[];
    businessId:string;
    individual:Individual;
    nidModel:NIDOCRMOdel;
    dialogLoad:boolean;
    ocrInfoDisabled:boolean=true;
    kycPersons:NIDOCRMOdel[];
    currentPersonInfo:NIDOCRMOdel;
    viewDetail:boolean  = false;
    ShowkeyDetailInfo:boolean = false;
    uploadErrorMsg:string;
    kitNo:String;
    cardDetails:{};
    showHistory:boolean = false;
    currentHistory = "";
    isCardAlreadyAssigned = false;
    loading:boolean;
    window:SystemWindow;

    statuses: MenuItem[];

    /*{
      "cardHolderName": "MOHAFMD0DED Mohafme0d",
      "expiryDate": "0728",
      "cardNo": "4855XXXXXXXX4312",
      "preference": {
          "atm": true,
          "pos": true,
          "ecom": true,
          "international": true,
          "dcc": true,
          "limitConfig": [
              {
                  "txnType": "ECOM",
                  "dailyLimitValue": "10000.0"
              },
              {
                  "txnType": "POS",
                  "dailyLimitValue": "10000.0"
              },
              {
                  "txnType": "ATM",
                  "dailyLimitValue": "10000.0"
              }
          ]
      },
      "cardStatus": "ALLOCATED",
      "reference": "01151591059",
      "kitNo": "15920000431"
  };*/;

    constructor(private messageService: MessageService,private windowService:WindowService,private kYCService: KYCService,private individualService:IndividualService) {}
    async ngOnInit(): Promise<void> {
      var self = this;
      var windowKey = 'window#'+64;
      var stringWindow = localStorage.getItem(windowKey);
      if(stringWindow&&stringWindow!=null){
        this.window = JSON.parse(stringWindow);
        self.loading = false; 

      }else {
     await this.windowService.getWindowById(64).then((response:any) => {
      self.window = response['data'];
      if(self.window!=null && self.window){
        localStorage.setItem(windowKey,JSON.stringify(this.window));
       }
       self.loading = false; 


  }, (err) => {
    self.loading = false; 

    self.error = [
      { severity: 'error', summary: 'Error', detail: err['status']+' : '+err['message'] },
  ];

  });
   
    }

      this.setStatus();

  this.findPending();

    this.crudSteps = [
      {
        label: 'Registration check',
        command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
    },
      {
          label: 'files upload',
          command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
      }, {
        label: 'Customer Info',
        command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
    },{
      label: 'review',
      command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
  },];



   
  
  this.reviewKYCSteps = [
    {
      label: 'Review KYC',
      command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
  },
    {
        label: 'Assigne Card',
        command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
    }];
  }


  setStatus(){
    this.statuses =  [
      {
          label: 'NOT Started',
          command: () => {
              this.updateUserStatus('NOT_STARTED');
          }
      },
      {
          label: 'INITIATED',
          command: () => {
              this.updateUserStatus('INITIATED');
          }
      },
      {
        label: 'Customer Pending',
        command: () => {
            this.updateUserStatus('CUSTOMER_PENDING');
        }
      }, {
        label: 'KYC Form Submitted',
        command: () => {
            this.updateUserStatus('KYC_FORM_SUBMITTED');
        }
      },
      {
        label: 'Maker Verify',
        command: () => {
            this.updateUserStatus('MAKER_VERIFY');
        }
      },
      {
        label: 'Checker Verify',
        command: () => {
            this.updateUserStatus('CHECKER_VERIFY');
        }
      },
      {
        label: 'DEPRECATED',
        command: () => {
            this.updateUserStatus('DEPRECATED');
        }
      },   {
        label: 'Bank Maker Approved',
        command: () => {
            this.updateUserStatus('BANK_MAKER_APPROVED');
        }
      },   {
        label: 'Bank Checker Approved',
        command: () => {
            this.updateUserStatus('BANK_CHECKER_APPROVED');
        }
      },   {
        label: 'KYC Expired',
        command: () => {
            this.updateUserStatus('KYC_EXPIRED');
        }
      }

    ];
  }



  updateUserStatus(status){
    this.kYCService.updateSatus(this.currentPersonInfo.business_id,status).then(()=>{

      this.currentPersonInfo.status = status;
    });
  }

  findPending (){
    this.kYCService.findallPendingKYC().then((data =>{
      this.kycPersons = data['content'];
      console.log(data);
    })).catch((error)=>{
      console.log(error);
    });
  }
  
      async onUpload(event:UploadEvent) {
        this.error = [];

        this.dialogLoad = true;
        var self = this;
        var frontImg = null;
        var back = null;
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }
        await this.blobUrlToBase64(this.uploadedFiles[0].objectURL.changingThisBreaksApplicationSecurity).then((data)=>{
          frontImg = data;
        });
        await this.blobUrlToBase64(this.uploadedFiles[1].objectURL.changingThisBreaksApplicationSecurity).then((data)=>{
          back = data;
        });

        this.kYCService.processKYCWithNationalId(frontImg,back,self.businessId).then((data)=>{
          this.nidModel = data['result'];
          this.nidModel.frontImage = frontImg;
          this.nidModel.backImage = back;
          this.activeStepIndex = 2;
          this.dialogLoad = false;

        }).catch((error)=>{
          this.error = [];
          this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['message'] });

          this.dialogLoad = false;
        });
        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
      }

      openCrudPopUp(action){
        this.error = [];
        this.nidModel = null;
        this.crudPopup = true;
        this.nidModel = null;
        this.businessId = null;
        this.individual = null;
        this.activeStepIndex = 0;
      }


      searchForBusinessId(){
        this.error = [];
        this.dialogLoad = true;
        this.individualService.findIndividualByBusinessId(this.businessId).then(data=>{
          this.individual = data;
          this.dialogLoad = false;
          console.log(this.individual );
        }).catch(error =>{
      this.error =[];
      if(error.error!=null){
      this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['errorMsg'] });
    }else {
      this.error.push({ severity: 'error', summary: 'Error', detail: error['statusCode'] });
    }
    this.dialogLoad = false;

        });
      }

      nextStep(){
        this.activeStepIndex++;
      }

      onHide(event){
        this.individual = null;
        this.activeStepIndex = 0;
      }


      async blobUrlToBase64(blobUrl: string): Promise<string> {
        try {
          // Fetch the blob from the URL
          const response = await fetch(blobUrl);
          const blob = await response.blob();
      
          // Create a new FileReader to read the blob as a data URL (Base64)
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              // Get the Base64 string part of the data URL
              const base64String = (reader.result as string).split(',')[1];
              resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          throw new Error(`Failed to convert blob URL to Base64: ${error}`);
        }
      }



      getSeverity(status: string) {
        switch (status) {
            case 'NOT_STARTED':
                return 'info';
            case 'INITIATED':
                return 'primary';
            case 'REJECTED':
              case 'MAKER_REJECTED':
                case 'CHECKER_REJECTED':
                return 'danger';
                case 'APPROVED':
                case 'LITE_KYC':
                case 'BANK_MAKER_APPROVED':
                  case 'BANK_CHECKER_APPROVED':
                return 'success';
                case 'WAITING_FOR_APPORVAL':
                return 'warning';
                default:
                  return 'info';
        }
    }

    backFromDetailInfo(){
      this.error = [];
      this.currentPersonInfo = null;
      this.businessId = null;
      this.reviewActiveIndex = 0;
      this.cardDetails = null;
      this.dialogLoad = false;
      this.kitNo = null;
      this.ShowkeyDetailInfo = false;
      this.viewDetail = false;
    }
    async onDetailClicked(row){
      this.error = [];
      this.currentPersonInfo = row;
      this.businessId = null;
      this.reviewActiveIndex = 0;
      this.cardDetails = null;
      this.dialogLoad = false;
      this.kitNo = null;
      this.ShowkeyDetailInfo = true;
      if(row['status']=='APPROVED'|| row['status']=='REJECTED'){
        this.reviewKYCSteps = [
          {
            label: 'Review KYC',
            command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
        }];
        }else {
          this.reviewKYCSteps = [
            {
              label: 'Review KYC',
              command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
          },
            {
                label: 'Assigne Card',
                command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
            }];
          }
      
      
      await this.kYCService.fetchResult(this.currentPersonInfo.business_id).then((data)=>{
        this.dialogLoad =false;
        this.currentPersonInfo.frontImage = data['front_img'];
        this.currentPersonInfo.backImage = data['back_img'];
        this.viewDetail = true;

      }).catch((error)=>{
        this.dialogLoad = false;
        this.error = [];
        if(error['error']['errorCode']=='KC01')
          this.error.push({ severity: 'info', summary: 'Info', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });
          else
      this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });

        this.dialogLoad = false;
      });

    }

    async onViewClicked(row){
      this.error = [];
      this.currentPersonInfo = row;
      this.businessId = null;
      this.reviewActiveIndex = 0;
      this.cardDetails = null;
      this.dialogLoad = true;
      this.kitNo = null;
      this.isCardAlreadyAssigned = false;
      if(row['status']=='APPROVED'|| row['status']=='REJECTED'){
        this.reviewKYCSteps = [
          {
            label: 'Review KYC',
            command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
        }];
        }else {
          this.reviewKYCSteps = [
            {
              label: 'Review KYC',
              command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
          },
            {
                label: 'Assigne Card',
                command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
            }];
          }
        
         await this.kYCService.fetchCardDetails(this.currentPersonInfo.business_id).then((data)=>{
            this.cardDetails = data;  
            this.isCardAlreadyAssigned = true;

          }).catch((error)=>{});
          this.viewDetail = true;

       this.kYCService.fetchResult(this.currentPersonInfo.business_id).then((data)=>{
        this.dialogLoad =false;
        this.currentPersonInfo.frontImage = data['front_img'];
        this.currentPersonInfo.backImage = data['back_img'];
        this.viewDetail = true;

      }).catch((error)=>{
        this.dialogLoad = false;
        this.error = [];
        if(error['error']['errorCode']=='KC01')
          this.error.push({ severity: 'info', summary: 'Info', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });
          else
      this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });

        this.dialogLoad = false;
      });

    }


    update(){
      this.dialogLoad = true;
      this.error = [];
        this.kYCService.updateOCRData(this.businessId,this.nidModel).then((data)=>{
          this.dialogLoad = false;
          this.ocrInfoEnableUpdate();
        }).catch((error)=>{

          this.error = [];
          this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['message'] });
          this.dialogLoad = false;
        });
    }
    confirm(){
      this.ocrInfoDisabled = true;
      this.dialogLoad = true;
      this.error = [];
      this.kYCService.confirmData(this.businessId).then((data)=>{
        this.error = [];
        this.dialogLoad = false;
        this.activeStepIndex=3;
        this.findPending();
      }).catch((error)=>{

        this.error = [];
        if(error['error']['errorCode']=='KC01')
          this.error.push({ severity: 'info', summary: 'Info', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });
          else
      this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });

        this.dialogLoad = false;
      });
    }

    approve(){
      this.ocrInfoDisabled = true;
      this.dialogLoad = true;
      this.kYCService.approve(this.currentPersonInfo.business_id).then((data)=>{
        this.currentPersonInfo.status='APPROVED';
        this.error = [];
        this.dialogLoad = false;
        this.findPending();
      }).catch((error)=>{

        this.error = [];
        if(error['error']['errorCode']=='KC01')
          this.error.push({ severity: 'info', summary: 'Info', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });
          else
      this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });

        this.dialogLoad = false;
      });
    }


    linkCard(){
      this.error = [];
      this.dialogLoad = false;
      this.reviewActiveIndex = 1;
      this.ocrInfoDisabled = true;
    }
    ocrInfoEnableUpdate(){
      this.ocrInfoDisabled = !this.ocrInfoDisabled;
    }

    testAssigneCarD(){
      this.reviewActiveIndex = 1;
      this.error = [];
      this.dialogLoad = false;
    }
    reject(){
      this.ocrInfoDisabled = true;
      this.dialogLoad = true;
      this.kYCService.reject(this.currentPersonInfo.business_id).then((data)=>{
        this.error = [];
        this.viewDetail = false;
        this.reviewActiveIndex = 1;
        this.findPending();
        this.closeDialog();
      }).catch((error)=>{
        this.error = [];

        if(error['error']['errorCode']=='KC01')
          this.error.push({ severity: 'info', summary: 'Info', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });
          else
      this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });

        this.dialogLoad = false;
      });
    }
    viewCardDetails(){

    }
    requestCard(){
      this.dialogLoad = true;
      var request = {};
      request['businessReference']=this.currentPersonInfo.business_id;
      request['firstName']=this.currentPersonInfo.first_name;
      request['lastName']=this.currentPersonInfo.full_name;
      request['kitNo']=this.kitNo;
      request['date_of_birth'] = this.currentPersonInfo.date_of_birth;
      request['nationalId'] = this.currentPersonInfo.front_nid;
      this.error = [];

      this.kYCService.requestCard(request).then((data)=>{
        this.cardDetails = data;
        this.error = [];
        this.dialogLoad = false;
      }).catch((error)=>{
        this.error = [];
          if(error['error']['errorCode']=='KC01')
            this.error.push({ severity: 'info', summary: 'Info', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });
            else
        this.error.push({ severity: 'error', summary: 'Error', detail: error['error']['error']?error['error']['error']:error['error']['errorMsg']?error['error']['errorMsg']:error['error']['message'] });

        this.dialogLoad = false;
      });
    }


    closeDialog(){
      this.dialogLoad = false;
      this.kitNo = null;
    this.viewDetail = false;
      this.cardDetails = null;
      this.currentPersonInfo = null;
      this.reviewActiveIndex = 0;
      this.nidModel = null;
      this.activeStepIndex = 0;
      this.businessId = null;
    }
    


    

  exportExcel() {
      import("xlsx").then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(this.kycPersons);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, "Clync-Kyc");
      });
  }

 
  saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  showKycHistory(id) :void{
    this.currentHistory = "";
    this.kYCService.findallKycHistory(id).then((data)=>{
      for(let line of data['result']){
           this.currentHistory += line.replaceAll(';','<br />');
      } 
      this.showHistory = true;

    });
  }
  selectSutatus(v){

  }



  isAccessible(fName){
   return this.window.tabs[0].tabFunctions.find((func)=>{return func.name==fName;});
}
  }