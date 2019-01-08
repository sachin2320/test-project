import { APPCONFIG } from '../../config';
import { AppConfig } from "app/configuration/app.config";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-app-footer',
  styles: [],
  templateUrl: './footer.component.html'
})

export class AppFooterComponent implements OnInit {
  public AppConfig: any;

  constructor(public config: AppConfig) {
  }

  ngOnInit() {
    this.AppConfig = APPCONFIG;
  }
}
