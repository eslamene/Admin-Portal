import { Component, OnInit } from "@angular/core";
import { MessageService } from 'primeng/api';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
    selector: 'sys-window',
    templateUrl: './settelment-reconciliation.html',
    styleUrls: ['./settelment-reconciliation.scss'],
    providers:[MessageService]
  })
  export class SettelmentAndReconsiliationComponent implements OnInit {
    uploadedFiles: any[] = [];

    constructor(private messageService: MessageService) {}
  ngOnInit(): void {
  }

    onUpload(event:UploadEvent) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
      }

  }