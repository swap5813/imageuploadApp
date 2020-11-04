import { SafeUrl } from '@angular/platform-browser';

export interface Files {
    name: String;
    date: Date;
    format: String;
    size: String;
    image: SafeUrl;
    url: String;
  }