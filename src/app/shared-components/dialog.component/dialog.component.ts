import { Component, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'fgl-dialog',
    templateUrl: './dialog.component.html'
})

export class FglDialogComponent {
    title: string = "";
    body: string = "";

    firstButtonCaption: string = "Ok";
    firstButtonReturnValue: any = null;

    secondButtonCaption: string = "Cancel";
    secondButtonReturnValue: any = null;

    isUserNotAuthorize: boolean = false;

    constructor(public dialogRef: MatDialogRef<FglDialogComponent>) { }
}