import { Component } from '@angular/core';

@Component({
  selector: 'fgl-home',
  template: `<router-outlet></router-outlet>`
})

export class HomeComponent {
  public homeType: string = "";

  constructor() {
  }
}
