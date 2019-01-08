import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { ToolTipComponent } from "app/shared-components/toolTip-component/toolTip.component";

@Component({
    selector: 'payment-mode',
    templateUrl: './paymentMode.component.html'
})

export class PaymentModeComponent implements OnInit {
    paymentModeStep1: boolean = true;
    paymentModeStep2: boolean = false;
    paymentModeStep3: boolean = false;
    policies: any[] = [];

    constructor(public dialog: MatDialog) { }
    ngOnInit() {
        this.policies = [
            { id: '1', number: 'L12334566' },
            { id: '2', number: 'L23434566' },
        ];
    }

    navigate(paymentMode: string) {
        if (paymentMode == "paymentModeStep1") {
            this.paymentModeStep1 = false;
            this.paymentModeStep3 = false;
            this.paymentModeStep2 = true;
        }
        if (paymentMode == "paymentModeStep2") {
            this.paymentModeStep1 = false;
            this.paymentModeStep2 = false;
            this.paymentModeStep3 = true;
        }
    }

    openDialog(toolTipTitle: string, toolTipMessage: string) {
        let config = new MatDialogConfig();
        let dialogRef: MatDialogRef<ToolTipComponent> = this.dialog.open(ToolTipComponent, config);
        dialogRef.componentInstance.toolTipTitle = toolTipTitle;
        dialogRef.componentInstance.toolTipMessage = toolTipMessage;
        dialogRef.afterClosed().subscribe(x=>{
            alert(x);
        });
    }
}


