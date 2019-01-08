import { AppConfig } from "app/configuration/app.config";
import { Component, OnInit } from '@angular/core';
import { DocumentModel } from "app/models/document.model";
import { NgModule } from '@angular/core';
import { Router } from "@angular/router";


@Component({
    selector: 'statement-detail',
    styles: [],
    templateUrl: './statement-detail.component.html'
})

export class StatementDetailComponent implements OnInit {
    policies: any[] = [];
    statementDocModel: DocumentModel;

    constructor() { }
    ngOnInit() {
        this.policies = [
            { id: '1', number: 'L12342227' },
            { id: '2', number: 'L12345523' },
            { id: '3', number: 'L12345526' },
        ];
    }

    onPolicyChange(policyObj) {
        //TODO:Need to replace below code by fetching data from service and db.
        if (policyObj.value == "L12342227") {
            this.statementDocModel = new DocumentModel("01-01-2017", policyObj.value);
        }
        else if (policyObj.value == "L12345523") {
            this.statementDocModel = new DocumentModel("07-01-2017", policyObj.value);
        }
        else { this.statementDocModel = new DocumentModel("17-01-2017", policyObj.value); }

    }

}
