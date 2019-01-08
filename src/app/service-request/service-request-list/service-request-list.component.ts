import { Component, OnInit } from '@angular/core';
import { AppConfig } from "app/configuration/app.config";

@Component({
  selector: 'service-request-list',
  styles: [],
  templateUrl: './service-request-list.component.html'
})

export class ServiceRequestListComponent implements OnInit {
  public isServiceListLoaded: boolean = false;
  constructor(public config: AppConfig) { }
  ngOnInit() { }

  onServiceListLoadComplete() {
    this.isServiceListLoaded = true;
  }
}
