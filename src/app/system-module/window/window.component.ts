import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { WindowService } from '../services/window.service';
import { SystemWindow } from '../services/dto/systemwindow.model'
import { Tab } from '../services/dto/tab.model';
import { Message } from 'primeng/api';

@Component({
  selector: 'sys-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  windowid:number=  0;
  window:SystemWindow;
  tabIndex:number = 0;
  recordid:number = 0;
  isLoaded:boolean = true;
  loading:boolean = true;
  constructor(private route: ActivatedRoute, private router: Router,private windowService:WindowService) { }
  error:Message[];
  async ngOnInit() {

    await this.reloadComponent();

  }

   async reloadComponent(){
    let self = this;


    let windowid = this.route.snapshot.paramMap.get('windowid') as string;

    let recordid = this.route.snapshot.paramMap.get('recordid') as string;
    if(windowid!=null)
    this.windowid = Number.parseInt(windowid);
    
    if(recordid!=null)
    self.recordid =Number.parseInt(recordid);
  var windowKey = 'window#'+this.windowid;
      var stringWindow = localStorage.getItem(windowKey);
      if(stringWindow&&stringWindow!=null){
        this.window = JSON.parse(stringWindow);
        self.loading = false; 

      }else {
     await this.windowService.getWindowById(this.windowid).then((response:any) => {
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }
  handleChange($event:any){
    console.log(this.tabIndex);
  }


   isDisabled(tab:Tab) :boolean{
    var parentTab = this.window.tabs.filter((tabP=>tab.Parent_Tab_Id==tabP.id));

    return parentTab.length==0?false:parentTab[0]['currentRow']==null;
  }
  update:boolean = true;
  windowMode($event:any){
    this.recordid = $event;
    if(this.recordid==0){
    this.reloadComponent();
      this.tabIndex = 0;
  }else {
    this.changeTabIndex();
    this.tabIndex = 0;
  }
  }

  changeTabIndex(){
    this.tabIndex = -1;
  }



}
