import { Component, OnInit, Input} from '@angular/core';
import { ServiceRequestType } from 'app/enums/service-type.enum';

@Component({
    selector: 'mail-fax-info',
    styles: [],
    templateUrl: './mail-fax-info.component.html'
})

export class MailFaxInfoComponent implements OnInit {
    @Input('showlifeannuityfax') showLifeAnnuityFax: boolean = true;
    @Input('showlifefax') showLifeFax: boolean = false;
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;
    
    constructor() { 
    }

    ngOnInit() {
    }
}