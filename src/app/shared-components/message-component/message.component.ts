import {Component, Input} from '@angular/core';

@Component({
    selector: 'fgl-message',
    templateUrl: './message.component.html'
})

export class FglMessageComponent{ 
    @Input('message') messageString: string;
    @Input('isalignleft') isAlignLeft: boolean = false;
}