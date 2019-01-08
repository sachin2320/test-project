import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { NavigationStateChangeModel } from "app/models/navigationStateChange.model";


@Injectable()
export class DataService {

    public serviceRequestNavigationStateChanged = new Subject<NavigationStateChangeModel>();
    public serviceRequestNavigationData: NavigationStateChangeModel = null;

    // //This variable will store the service request type which was selected at Service Selection Page.
    // public selectedServiceRequestType:any=null;
    // public selectedServiceRequestPolicy:any=null;
}