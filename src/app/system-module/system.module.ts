import { NgModule } from '@angular/core';
import { WindowComponent } from "./window/window.component";
import { InputFieldComponent } from "./input-field/input-field.component";
import { TableModule } from "primeng/table";
import { InputSwitchModule } from "primeng/inputswitch";
import { SystemComponent } from "./system.component";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
//import { NgSelectModule } from "@ng-select/ng-select";
import { TabComponent } from "./window/tab/tab.component";
import { GridComponent } from "./window/tab/grid/grid.component";
import { CommonModule } from "@angular/common";
import { TabViewModule } from 'primeng/tabview';
import { FormComponent } from "./window/tab/form/form.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfigService } from "./services/config.service";
import { WindowService } from "./services/window.service";
import { DropdownModule } from 'primeng/dropdown';
import { SplitterModule } from 'primeng/splitter';
import { GenericService } from "./services/generic.service";
import { MenuService } from "./services/menu.service";
import { FileService } from "./services/file.service";
//import { ModalModule } from 'ngx-bootstrap/modal';
//import { MaterialModule } from "../shared/material/material.module";
//import { DatepickerModule } from "ng2-datepicker";
//import { ListToListComponent } from "./window/tab/list-to-list/list-to-list";
import { DialogModule } from 'primeng/dialog';
import { UtileService } from "./services/util.service";
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { CalendarModule } from 'primeng/calendar';
import { StepsModule } from 'primeng/steps';
import { UserService } from "./services/user.service";
import { FieldService } from "./services/field.service";
import { SettelmentAndReconsiliationComponent } from "./settelment-reconciliation/settelment-reconciliation";
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { ProcessComponent } from "./process/process.component";
import { KYCComponent } from "./kyc/kyc";
import { KYCDashboard } from "./kyc-dashboard/dashboard-component";
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { KYCService } from "./services/kyc.service";
import { IndividualService } from "./services/individual.service";

import { SplitButtonModule } from 'primeng/splitbutton';

const systemPagesRoutes: Routes = [{
    path: '',
    component: SystemComponent,
    children: [
      {
        path: 'window/:windowid',
        component: WindowComponent,
      },
      {
        path: 'process/:processid',
        component: ProcessComponent,
      },
      {
        path: 'window/:windowid/:recordid',
        component: WindowComponent,
      },
      {
        path: 'settelment-reconciliation',
        component: SettelmentAndReconsiliationComponent,
      },
      {
        path: 'kyc/request',
        component: KYCComponent,
      },
      {
        path: 'kyc/dashboard',
        component: KYCDashboard,
      }
    ],
  }];


  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forChild(systemPagesRoutes),
      TableModule,
      SplitterModule,
      TagModule,
      StepsModule,
      MessagesModule,
      SplitButtonModule,
      TabViewModule,
      ConfirmDialogModule,
      InputNumberModule,
      ToastModule,
      BadgeModule,
      InputSwitchModule,
      DropdownModule,
      DialogModule,
      ProgressSpinnerModule,
      CalendarModule,
      FileUploadModule,
      ImageModule,
      CardModule
    ],
    declarations: [
      WindowComponent,
      KYCComponent,
      KYCDashboard,
      FormComponent,
      TabComponent,
      ProcessComponent,
      GridComponent,
      InputFieldComponent,
      SystemComponent,
      SettelmentAndReconsiliationComponent
    ],
    providers: [
      ConfigService,
      WindowService,
      UtileService,
      GenericService,
      MenuService,
      FileService,
      UserService,
      FieldService,
      KYCService,
      IndividualService
    ]
  })
  export class SystemModule { }
  
