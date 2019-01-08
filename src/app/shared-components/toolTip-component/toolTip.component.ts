import { Component, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'fgl-toolTip',
    templateUrl: './toolTip.component.html'
})

export class ToolTipComponent {
    toolTipTitle: string;
    toolTipMessage: string;

    constructor(public dialogRef: MatDialogRef<ToolTipComponent>) { }     
      
}