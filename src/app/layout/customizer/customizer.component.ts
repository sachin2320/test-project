import { APPCONFIG } from '../../config';
import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'my-app-customizer',
  styles: [],
  templateUrl: './customizer.component.html',
})

export class AppCustomizerComponent implements OnInit {
  constructor(private layoutService: LayoutService) {}
  public AppConfig: any;

  ngOnInit() {
    this.AppConfig = APPCONFIG;
  }

  onLayoutChange = () => {
    this.layoutService.updateEChartsState(true);
  }
}
