import { AppConfig } from "app/configuration/app.config";
import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-app-sidenav-menu',
  styles: [],
  templateUrl: './sidenav-menu.component.html'
})

export class AppSidenavMenuComponent {
  constructor(public config: AppConfig, ) { }
}
