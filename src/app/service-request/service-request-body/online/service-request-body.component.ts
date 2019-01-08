import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ServiceRequestType } from "app/enums/service-type.enum";
import { NavigationStateChangeModel } from "app/models/navigationStateChange.model";
import { BeneficiaryListComponent } from "app/service-request/beneficiaryList/beneficiaryList.component";

@Component({
    selector: 'servicerequest-body',
    styles: [],
    templateUrl: './service-request-body.component.html'
})

export class ServiceRequestBodyComponent implements OnInit {
    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('isprintonly') isPrintOnly: boolean = false;    
    @Input('servicetype') serviceType: ServiceRequestType = ServiceRequestType.None;
    @Input('policynumber') policyNumber: string = '';
    @Input('ownername') ownerName: string = '';
    
    @Output('onbodyvaluechanged') bodyValueChanged = new EventEmitter();
    @Output('onNavigationStateChange') navigationStateChanged = new EventEmitter();
    @Output('onError') onError = new EventEmitter();

    @ViewChild('beneficiaryListComponent') beneficiaryListComponent:BeneficiaryListComponent;
    
    constructor() {}

    onPageNavigation(isNext) {
        if(this.beneficiaryListComponent)
            this.beneficiaryListComponent.onPageNavigation(isNext);
    }

    ngOnInit() { }

    onBodyValueChanged(event) {      
        this.bodyValueChanged.emit(event);
    }
    
    onErrorRaised(event) { 
        this.onError.emit(event);
    }

    onNavigationStateChange(event:NavigationStateChangeModel){
        this.navigationStateChanged.emit(event);
    }
}