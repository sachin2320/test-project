import { ActivatedRoute } from '@angular/router';
import { AppConfig } from "app/configuration/app.config";
import { Component } from '@angular/core';

@Component({
    selector: 'home-dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent{
    public homeType: string = "";    
    public lastDayOfPreviousMonth: string = "";
    public dateFormat: string;

    constructor(private route: ActivatedRoute, public config: AppConfig) {
        this.route.queryParams.subscribe(params => {
            this.homeType = params['Type'] || "";
           
            this.dateFormat = this.config.getConfig("date_format");
            this.lastDayOfPreviousMonth = this.getLastDateOfPreviousMonth();
        });
    }

    getLastDateOfPreviousMonth() {
        var d = new Date(); 
        d.setDate(1); 
        d.setHours(-1); 
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toString();
    }
}
