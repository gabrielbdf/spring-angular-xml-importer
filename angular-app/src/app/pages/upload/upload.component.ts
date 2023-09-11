import { HttpClient, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { last } from 'rxjs/internal/operators/last';
import { tap } from 'rxjs/internal/operators/tap';

export interface FileSendInfo {
  file: File;
  status: string;
  sended: number;
}

@Component({
  selector: 'app-upload',
  template: `
    <div class="p-2">
      <div class="file-upload-box">
        <div (click)="file.click()" class="internal" (dragover)="onDrag($event)" (dragleave)="onDrag($event)" (drop)="onDrop($event)">
          <input (change)="addFileEvent($event.target)" style="display: none;" type="file" #file [multiple]="false" accept="application/xml" />
          <div><mat-icon (click)="file.click()">upload</mat-icon></div>
          <strong>Escolha um arquivo </strong> ou arraste aqui!
        </div>
      </div>
      <div class="file-list-sended">
        <div class="file-item" *ngFor="let fileInfo of fileList">
          <div class="file-icon">
            <mat-icon>file_open</mat-icon>
          </div>
          <div class="file-name">
              <div style="margin-bottom: 6px">
                <strong>{{fileInfo.file.name}}</strong> - {{fileInfo.status}}
              </div>
              <section class="example-section">
                <mat-progress-bar
                    [mode]="'determinate'"
                    [value]="fileInfo.sended">
                </mat-progress-bar>
              </section>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UploadComponent {

  private _http = inject(HttpClient);

  fileList: FileSendInfo[] = []

  addFileEvent(target: EventTarget | null) {
    if (target) {
      const files = (target as HTMLInputElement).files as FileList;
      this.uploadFile({ file: files[0], status: "Enviando arquivo", sended: 0 });
    }
  }

  private uploadFile(fileSenderInfo: FileSendInfo) {
    const headers = new HttpHeaders("Content-type: application/octet-stream");
    const req = new HttpRequest('POST', 'http://localhost:8080/upload', fileSenderInfo.file, {
      reportProgress: true,
      headers
    });
    this.fileList.push(fileSenderInfo);
    this._http.request(req).pipe(
      tap(event => {
        if (event.type == HttpEventType.UploadProgress) {
          const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          fileSenderInfo.sended = percentDone;
          if (percentDone == 100)
            fileSenderInfo.status = "Processando registros";
        }
      }),
      last(),
    ).subscribe(res => {
      fileSenderInfo.status = "Arquivo enviado com sucesso";
    })
  }

  onDrag(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files as FileList;
    this.uploadFile({ file: files[0], status: "Enviando arquivo", sended: 0 });
  }


}
