import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AppConfig } from "app/configuration/app.config";

@Injectable()
export class SnackbarService {
    public subject = new Subject<MessageModel>();
    public keepAfterNavigationChange = false;

    constructor(private snackBar: MatSnackBar, 
        private router: Router,
        public config: AppConfig,
    ) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });

        this.subject.asObservable().subscribe(msg => {
            if (msg != undefined && msg.message) {
                this.snackBar.open(msg.message, msg.actionName, {
                    duration: 10000,
                    panelClass: ['success-snackbar']
                });
            }
            else {
                this.snackBar.dismiss()
            }
        });
    }

    popupSnackbar(notificationText: string, actionText: string = "Ok", keepAfterNavigationChange:boolean = false) {
        let showSnackBar = this.config.getConfig("showSnackBarNotification");
        if (showSnackBar) {
            this.keepAfterNavigationChange = keepAfterNavigationChange;
            let msgModel: MessageModel = new MessageModel(notificationText, actionText);
            this.subject.next(msgModel);
        }
    }
}

class MessageModel {
    constructor(public message: string, public actionName: string) { }
}