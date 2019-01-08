
import { Component, Input } from "@angular/core";

@Component({
    selector: 'fgl-spinner-small',
    templateUrl: './spinnerSmall.component.html'
})

export class SpinnerSmallComponent {    
    @Input('requesting') isRequesting: boolean = false;
}