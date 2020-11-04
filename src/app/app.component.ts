import { Component, ViewChild, ElementRef } from '@angular/core';
import { Files } from './models/files';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FileSaverService } from 'ngx-filesaver';
import { FileSaverOptions, saveAs  } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'imageuploadApp';

  constructor(private _sanitizer: DomSanitizer, private _httpClient: HttpClient, private _fileSaverService: FileSaverService) {}

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  @ViewChild("selectFile") selectFile;

  files: any[] = [];
  headElements: any[] = ['Name', 'Date', 'Format', 'Size', 'Image'];
  displayedColumns: string[] = ['name', 'date', 'format', 'size', 'image'];
  date: String;
  imageThumbnail: SafeUrl;
  savePath: String = 'D:\IDM_Photo\\';
  URL: String = 'http://localhost:8080/api';

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    const delfile  = this.files[index];
    const fileName = delfile.name;
    this.files.splice(index, 1);
    this._httpClient.put(this.URL + '/delete', {fileName})
    .subscribe((response) => {
         console.log('response received is ', response);
    })
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      console.log(item);
      this.date = new Date().toISOString().slice(0,10);
      this.imageThumbnail = this._sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(item)));;
      item.image = this.imageThumbnail;

      this.files.push(item);
      console.log("file is added " + item);
    }
    this.uploadFile(files);
    this.fileDropEl.nativeElement.value = "";
  }

  uploadFile(files: Array<any>) {
    let formData = new FormData();
    for (const file of files) {
        formData.append("uploads[]", file, file.name);
        console.log(file);
        this._httpClient.post(this.URL + '/save', formData)
        .subscribe((response) => {
             console.log('response received is ', response);
        })
    }
  }
}
