
import { Component, Input } from "@angular/core";
import { PolicyRmdModel } from "app/models/rmd.model";
import { AppConfig } from "app/configuration/app.config";
import { GridRowModel } from "app/models/gridRow.model";
import { GridColumnModel } from "app/models/gridColumn.model";
import { GridDataModel } from "app/models/gridData.model";
import { ColumnType } from "app/enums/column-type.enum";


@Component({
    selector: 'demo-sanjeev',
    templateUrl: './demo-sanjeev.component.html'
})

export class DemoSanjeevComponent {
    //model: DemoModel;
    dataSource: GridRowModel[] = [];
    columns: GridColumnModel[] = [];

    parimaryBenfDataSource: GridRowModel[] = [];
    parimaryBenfColumns: GridColumnModel[] = [];

    contigentBenfDataSource: GridRowModel[] = [];
    contigentBenfColumns: GridColumnModel[] = [];

    documentDataSource: GridRowModel[] = [];
    documentColumns: GridColumnModel[] = [];

    dateFormat: string;
    pdfReturn : any;

    constructor(public config: AppConfig) {
        this.dateFormat = this.config.getConfig("date_format");
    }

    ngOnInit() {
        this.setGridData();
        this.setPrimaryBenfGridData();
        this.setContingentBenfGridData();
        this.setDcoumentData();
    }

    setGridData() {
        let rowColumns: GridDataModel[] = [];
        this.columns.push(new GridColumnModel("Owner", "Owner", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("Bobby Smith", ColumnType.Text, "first-col-policy-width"));

        this.columns.push(new GridColumnModel("PolicyNumber", "Policy number", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("L1234567", ColumnType.Text, "first-col-policy-width"));

        this.columns.push(new GridColumnModel("Submitted", "Submitted", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("08/07/2017", ColumnType.Date, "first-col-policy-width"));

        this.columns.push(new GridColumnModel("Status", "Status", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("Submitted", ColumnType.Text, "first-col-policy-width"));

        this.columns.push(new GridColumnModel("LastUpdated", "Last Updated", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("08/16/2017", ColumnType.Date, "first-col-policy-width"));

        this.dataSource.push(new GridRowModel(rowColumns));
    }

    setPrimaryBenfGridData() {
        let rowColumns: GridDataModel[] = [];

        this.parimaryBenfColumns.push(new GridColumnModel("Firstname", "First name", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("MI", "M.I.", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("Lastname", "Last name", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("Relationship", "Relationship", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("Address", "Address", "width200px"));
        this.parimaryBenfColumns.push(new GridColumnModel("City", "City", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("State", "State*", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("Zipcode", "Zipcode", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("TIN", "SS/TIN#", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("DOB", "Date of birth", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("Phone", "Phone number", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("Email", "Email", "first-col-policy-width"));
        this.parimaryBenfColumns.push(new GridColumnModel("Benefit", "Benefit%", "first-col-policy-width"));


        rowColumns.push(new GridDataModel("Sarah", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("H.", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("Smith", ColumnType.Text));
        rowColumns.push(new GridDataModel("Daughter", ColumnType.Text));
        rowColumns.push(new GridDataModel("222 W. 40th St.", ColumnType.Text));
        rowColumns.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns.push(new GridDataModel("***-**-2211", ColumnType.Text));
        rowColumns.push(new GridDataModel("**/**/1984", ColumnType.Date));
        rowColumns.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("sarah.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("40%", ColumnType.Text, "first-col-policy-width"));
        this.parimaryBenfDataSource.push(new GridRowModel(rowColumns));

        let rowColumns1: GridDataModel[] = [];
        rowColumns1.push(new GridDataModel("John", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("Smith", ColumnType.Text));
        rowColumns1.push(new GridDataModel("Son", ColumnType.Text));
        rowColumns1.push(new GridDataModel("222 W. 40th St.", ColumnType.Text));
        rowColumns1.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns1.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns1.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns1.push(new GridDataModel("***-**-5252", ColumnType.Text));
        rowColumns1.push(new GridDataModel("**/**/1985", ColumnType.Date));
        rowColumns1.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("john.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("30%", ColumnType.Text, "first-col-policy-width"));
        this.parimaryBenfDataSource.push(new GridRowModel(rowColumns1));

        let rowColumns2: GridDataModel[] = [];
        rowColumns2.push(new GridDataModel("Rachel", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("J.", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("Smith", ColumnType.Text));
        rowColumns2.push(new GridDataModel("Daughter", ColumnType.Text));
        rowColumns2.push(new GridDataModel("222 W. 40th St.", ColumnType.Text));
        rowColumns2.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns2.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns2.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns2.push(new GridDataModel("***-**-2222", ColumnType.Text));
        rowColumns2.push(new GridDataModel("**/**/1990", ColumnType.Date));
        rowColumns2.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("rachel.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("15%", ColumnType.Text, "first-col-policy-width"));
        this.parimaryBenfDataSource.push(new GridRowModel(rowColumns2));   
        
        let rowColumns3: GridDataModel[] = [];
        rowColumns3.push(new GridDataModel("Steve", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("Smith", ColumnType.Text));
        rowColumns3.push(new GridDataModel("Son", ColumnType.Text));
        rowColumns3.push(new GridDataModel("222 W. 40th St.", ColumnType.Text));
        rowColumns3.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns3.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns3.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns3.push(new GridDataModel("***-**-2222", ColumnType.Text));
        rowColumns3.push(new GridDataModel("**/**/1990", ColumnType.Date));
        rowColumns3.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("steve.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("15%", ColumnType.Text, "first-col-policy-width"));
        this.parimaryBenfDataSource.push(new GridRowModel(rowColumns3));    
    }

    setContingentBenfGridData() {
        let rowColumns: GridDataModel[] = [];

        this.contigentBenfColumns.push(new GridColumnModel("Firstname", "First name", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("MI", "M.I.", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("Lastname", "Last name", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("Relationship", "Relationship", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("Address", "Address", "width200px"));
        this.contigentBenfColumns.push(new GridColumnModel("City", "City", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("State", "State*", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("Zipcode", "Zipcode", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("TIN", "SS/TIN#", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("DOB", "Date of birth", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("Phone", "Phone number", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("Email", "Email", "first-col-policy-width"));
        this.contigentBenfColumns.push(new GridColumnModel("Benefit", "Benefit%", "first-col-policy-width"));


        rowColumns.push(new GridDataModel("My first name is Sue", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("S.", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("My last name is Smith", ColumnType.Text));
        rowColumns.push(new GridDataModel("Niece", ColumnType.Text));
        rowColumns.push(new GridDataModel("I live in 222 W. 40th St.", ColumnType.Text));
        rowColumns.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns.push(new GridDataModel("***-**-2211", ColumnType.Text));
        rowColumns.push(new GridDataModel("**/**/1984", ColumnType.Date));
        rowColumns.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("sue.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns.push(new GridDataModel("40%", ColumnType.Text, "first-col-policy-width"));
        this.contigentBenfDataSource.push(new GridRowModel(rowColumns));

        let rowColumns1: GridDataModel[] = [];
        rowColumns1.push(new GridDataModel("My first name Teelad", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("H.", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("My last name Smith", ColumnType.Text));
        rowColumns1.push(new GridDataModel("Daughter", ColumnType.Text));
        rowColumns1.push(new GridDataModel("I used to live in  222 W. 40th St. My new address is 222 W. 41th St.", ColumnType.Text));
        rowColumns1.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns1.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns1.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns1.push(new GridDataModel("***-**-5252", ColumnType.Text));
        rowColumns1.push(new GridDataModel("**/**/1985", ColumnType.Date));
        rowColumns1.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("teelad.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns1.push(new GridDataModel("30%", ColumnType.Text, "first-col-policy-width"));
        this.contigentBenfDataSource.push(new GridRowModel(rowColumns1));

         let rowColumns2: GridDataModel[] = [];
        rowColumns2.push(new GridDataModel("Rachel", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("J.", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("Smith", ColumnType.Text));
        rowColumns2.push(new GridDataModel("Daughter", ColumnType.Text));
        rowColumns2.push(new GridDataModel("222 W. 40th St.", ColumnType.Text));
        rowColumns2.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns2.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns2.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns2.push(new GridDataModel("***-**-2222", ColumnType.Text));
        rowColumns2.push(new GridDataModel("**/**/1990", ColumnType.Date));
        rowColumns2.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("rachel.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns2.push(new GridDataModel("20%", ColumnType.Text, "first-col-policy-width"));
        this.contigentBenfDataSource.push(new GridRowModel(rowColumns2));   

        let rowColumns3: GridDataModel[] = [];
        rowColumns3.push(new GridDataModel("Steve", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("Smith", ColumnType.Text));
        rowColumns3.push(new GridDataModel("Son", ColumnType.Text));
        rowColumns3.push(new GridDataModel("222 W. 40th St.", ColumnType.Text));
        rowColumns3.push(new GridDataModel("Baltimore", ColumnType.Text));
        rowColumns3.push(new GridDataModel("MD", ColumnType.Text));
        rowColumns3.push(new GridDataModel("21222", ColumnType.Text));
        rowColumns3.push(new GridDataModel("***-**-2222", ColumnType.Text));
        rowColumns3.push(new GridDataModel("**/**/1990", ColumnType.Date));
        rowColumns3.push(new GridDataModel("443-444-4444", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("steve.smith@gmail.com", ColumnType.Text, "first-col-policy-width"));
        rowColumns3.push(new GridDataModel("10%", ColumnType.Text, "first-col-policy-width"));
        this.contigentBenfDataSource.push(new GridRowModel(rowColumns3));    

        
    }

    setDcoumentData() {
        let rowColumns: GridDataModel[] = [];
        this.documentColumns.push(new GridColumnModel("FileName", "File name", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("Admin2034", ColumnType.Text, "first-col-policy-width"));

        this.documentColumns.push(new GridColumnModel("Description", "Description", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("Power of Attorney", ColumnType.Text, "first-col-policy-width"));

        this.documentColumns.push(new GridColumnModel("DateAdded", "Date added", "first-col-policy-width"));
        rowColumns.push(new GridDataModel("08/07/2017", ColumnType.Date, "first-col-policy-width"));

        this.documentDataSource.push(new GridRowModel(rowColumns));
    }

    addDocuments()
    { }

    addComment()
    { }

    save()
    { }

    exit()
    { }

    print(pdf)
    {
        pdf.landscape =  true;
        pdf.paperSize = "A1";
        pdf.multiPage = true;
        pdf.title = "PHP";
        pdf.author = "PHP";
        pdf.creator = "PHP";
        pdf.date = new Date;
  
        this.pdfReturn= pdf.saveAs('beneficiary.pdf');
    }

    printPdf(pdf)
    {  
        pdf.saveAs('beneficiaryPdf.pdf');
    }

}