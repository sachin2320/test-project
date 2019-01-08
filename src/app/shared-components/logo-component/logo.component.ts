import {Component, Input} from '@angular/core';

@Component({
    selector: 'fgl-logo',
    templateUrl: './logo.component.html'
})

export class LogoComponent{ 
    @Input('isWhiteLogo') isWhiteLogo: boolean;
    @Input('width') logoWidth: string="238";
    @Input('height') logoHeight: string;
}