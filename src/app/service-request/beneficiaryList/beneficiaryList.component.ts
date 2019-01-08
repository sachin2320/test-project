import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppConfig } from 'app/configuration/app.config';
import { ServiceRequestType } from "app/enums/service-type.enum";
import { Beneficiary } from "app/models/beneficiary.model";
import { CountryModel } from 'app/models/country.model';
import { StateModel } from 'app/models/state.model';
import { NewBeneficiaryComponent } from 'app/shared-components/newBeneficiary-component/newBeneficiary.component';
import { CommonService } from 'app/shared-services/common.service';
import { SnackbarService } from 'app/shared-services/snackbar.service';
import { SpinnerService } from 'app/shared-services/spinner.service';

@Component({
    selector: 'beneficary-list',
    styles: [],
    templateUrl: './beneficiaryList.component.html'
})

export class BeneficiaryListComponent implements OnInit {
    @Input('isviewonly') isViewOnly: boolean = false;
    @Input('isprintonly') isPrintOnly: boolean = false;
    @Input('primarybenfmodel') primaryModel: Beneficiary[] = [];
    @Input('contingentbenfmodel') contingentModel: Beneficiary[] = [];

    @Output('onvaluechanged')
    valueChanged = new EventEmitter();

    @ViewChild('newBeneficiaryChild') newBeneficiaryChild: NewBeneficiaryComponent;

    public primaryBenefModel: any[] = [];
    public contingentBenefModel: any[] = [];

    public stateModel: StateModel[] = [];
    public countryModel: CountryModel[] = [];

    public isContainZeroPrimaryBenefit: boolean = false;
    public isContainZeroContingentBenefit: boolean = false;

    public contingentValidations: Map<number, boolean> = new Map<number, boolean>();
    public primaryValidations: Map<number, boolean> = new Map<number, boolean>();

    public primaryFormValue: Map<number, Beneficiary> = new Map<number, Beneficiary>();
    public contingentFormValue: Map<number, Beneficiary> = new Map<number, Beneficiary>();
    public userComment: string = "";
    public message: string = "";
    public isPrimaryBenfFormValid: boolean = false;

    constructor(private commonService: CommonService,
        private notification: SnackbarService,
        private spinner: SpinnerService,
        public config: AppConfig) { }

    onPageNavigation(isNext) {
        this.newBeneficiaryChild.onPageNavigation(isNext);
    }

    ngOnInit() {
        this.getCountry();
    }

    onPrimaryBeneficiaryValidated(event) {
        this.isPrimaryBenfFormValid = event.FormIsValid;
        this.primaryValidations.set(event.ComponentId, event.FormIsValid);
        this.emitResult();
    }

    onContingentBeneficiaryValidated(event) {
        this.contingentValidations.set(event.ComponentId, event.FormIsValid);
        this.emitResult();
    }

    onPrimaryValueChanged(event) {
        let old = this.primaryFormValue.get(event.ComponentId);
        if (old != undefined && JSON.stringify(old) == JSON.stringify(event.FormData))
            return false;

        this.primaryFormValue.set(event.ComponentId, event.FormData);
        this.emitResult();
    }

    onContingentValueChanged(event) {
        let old = this.contingentFormValue.get(event.ComponentId);
        if (old != undefined && JSON.stringify(old) == JSON.stringify(event.FormData))
            return false;

        this.contingentFormValue.set(event.ComponentId, event.FormData);
        this.emitResult();
    }

    emitResult(comment: any = "") {
        let result = {
            'RequestType': ServiceRequestType.ChangeBeneficiary,
            'PrimaryBeneficiaries': this.primaryFormValue,
            'ContingentBeneficiaries': this.contingentFormValue,
            'IsDataValid': this.isPageValid,
            'UserComment': comment == "" ? this.userComment : comment
        };
        this.valueChanged.emit(result);
    }

    emitComment(event) {
        this.emitResult(event);
    }

    addPrimaryBeneficiary() {
        this.addBeneficiary(true);
    }

    addContingentBeneficiary() {
        this.addBeneficiary(false);
    }

    removePrimaryBeneficiary(event) {
        this.removeBeneficiary(event.ComponentId);
    }

    removeContingentBeneficiary(event) {
        this.removeBeneficiary(event.ComponentId, false);
    }

    addBeneficiary(isPrimaryBenf: boolean) {
        let compId = this.getRandomInt(1, 50000);
        if (isPrimaryBenf) {
            if (this.primaryModel != null && this.primaryModel.length > 0) {
                this.primaryModel.forEach(benfX => {
                    this.primaryBenefModel.push({ key: compId, value: benfX });
                    compId = this.getRandomInt(1, 50000);
                });
            }
            else {
                let beneficiary = new Beneficiary();
                beneficiary.willDefaultValidationApply = this.primaryBenefModel.length <= 0 ? true : false;
                //As this is optional except first so assuming it is valid
                let isValidBeneficiary = this.primaryBenefModel.length < 1 ? false : true;

                this.primaryBenefModel.push({ key: compId, value: beneficiary });
                this.primaryValidations.set(compId, isValidBeneficiary);
            }
        }
        else {
            if (this.contingentModel != null && this.contingentModel.length > 0) {
                this.contingentModel.forEach(benfX => {
                    this.contingentBenefModel.push({ key: compId, value: benfX });
                    compId = this.getRandomInt(1, 50000);
                });
            }
            else {
                let beneficiary = new Beneficiary();
                this.contingentBenefModel.push({ key: compId, value: beneficiary });
                this.contingentValidations.set(compId, true); //As this is optional so assuming it is valid
            }
        }
    }

    // Added check for beneficiary array lengths and added setTimeout to address timing issue in Edge where 
    // removing a beneficiary was redirecting to the Login page.
    removeBeneficiary(componentId: any, isPrimaryBenf: boolean = true) {
        let index = -1;
        if (isPrimaryBenf) {
            // ALM-114 If one beneficiary, clear input - Change <= 1 to < 1
            if (this.primaryBenefModel.length < 1) return;
            index = this.primaryBenefModel.findIndex(x => x.key == componentId)
            if (index > -1) {
                setTimeout(() => {
                    this.primaryBenefModel.splice(index, 1);
                    this.validatePrimaryBeneficiary();
                    this.emitResult();
                }, 0);
            }

            this.primaryFormValue.delete(componentId);
            this.primaryValidations.delete(componentId);
            this.emitResult();

            // ALM-114 If one beneficiary, clear input - Change <= 0 to <= 1
            if (this.primaryBenefModel.length <= 1) {
                this.addBeneficiary(true);
                this.emitResult();
            }
        }
        else {
            // ALM-114 If one beneficiary, clear input - Change <= 1 to < 1
            if (this.contingentBenefModel.length < 1) return;
            index = this.contingentBenefModel.findIndex(x => x.key == componentId)
            if (index > -1) {
                setTimeout(() => {
                    this.contingentBenefModel.splice(index, 1);
                }, 0);
            }

            this.contingentFormValue.delete(componentId);
            this.contingentValidations.delete(componentId);
            this.emitResult();

            // ALM-114 If one beneficiary, clear input - Change <= 0 to <= 1
            if (this.contingentBenefModel.length <= 1) {
                this.addBeneficiary(false);
                this.emitResult();
            }
        }
    }

    get isPageValid(): boolean {
        let primaryResult: boolean = true;
        let contingentResult: boolean = true;

        //primary
        this.primaryValidations.forEach(element => {
            if (primaryResult && element == false)
                primaryResult = false;
        });

        //contingent
        this.contingentValidations.forEach(element => {
            if (contingentResult && element == false)
                contingentResult = false;
        });
        return (contingentResult && primaryResult && this.isPrimaryBenfValid && this.isContingentBenfValid && this.isSsnUniqueInList());
    }

    get primaryBenefit(): number {
        return this.calculatePercentage();
    }

    get contingentBenefit(): number {
        return this.calculatePercentage(false);
    }

    get isPrimaryBenfValid(): boolean {
        return this.validateBeneficiary();
    }

    get isContingentBenfValid(): boolean {
        return this.validateBeneficiary(false);
    }

    get enableAddPrimaryBeneficiary(): boolean {
        let calculatedPercentage = this.calculatePercentage();
        return calculatedPercentage < 100 && !this.isContainZeroPrimaryBenefit && calculatedPercentage > 0;
    }

    get enableAddContingentBeneficiary(): boolean {
        let calculatedPercentage = this.calculatePercentage(false);
        return calculatedPercentage < 100 && !this.isContainZeroContingentBenefit && calculatedPercentage > 0;
    }

    private validateBeneficiary(isPrimaryBenf: boolean = true): boolean {
        let benefit: number = 0;
        let count: number = 0;
        let isContainZeroBenefit: boolean = false
        let isValidationRequired: boolean = false;
        let beneficiaryModel: any;
        let formValue = isPrimaryBenf ? this.primaryFormValue : this.contingentFormValue;
        //primary
        formValue.forEach(element => {
            count++;
            if (this.isValidationRequired(element, element.willDefaultValidationApply))
                isValidationRequired = true;

            let benefitValue = Number(element.benefit);
            benefit = benefit + benefitValue
        });

        beneficiaryModel = isPrimaryBenf ? this.primaryBenefModel : this.contingentBenefModel;

        if (!((isValidationRequired && benefit == 100) || (!isValidationRequired && benefit == 0))) {
            if (beneficiaryModel.length > 0 && count > 0) {
                beneficiaryModel.forEach(element => {
                    if (!element.value.benefit || element.value.benefit == 0) {
                        isContainZeroBenefit = true
                    }
                });
            }

            if (isPrimaryBenf)
                this.isContainZeroPrimaryBenefit = isContainZeroBenefit;
            else
                this.isContainZeroContingentBenefit = isContainZeroBenefit;
        }

        return (isValidationRequired && benefit == 100) || (!isValidationRequired && benefit == 0);
    }

    private calculatePercentage(isPrimaryBenf: boolean = true): number {
        let totalBenefit: number = 0;
        let isContainZero: boolean = false;
        let formValue = isPrimaryBenf ? this.primaryFormValue : this.contingentFormValue;

        formValue.forEach(form => {
            if (!isNaN(Number(form.benefit)))
                totalBenefit = totalBenefit + Number(form.benefit);
        });

        return totalBenefit % 1 === 0 ? totalBenefit : parseFloat(totalBenefit.toFixed(2));
    }

    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private getCountry() {
        this.spinner.start();
        this.commonService.getCountries().subscribe(results => {
            this.spinner.stop();
            this.countryModel = results;
            this.addBeneficiary(true); //Primary
            this.addBeneficiary(false); //Contingent  
            this.spinner.stop();
        }, error => {
            this.spinner.stop();
            this.notification.popupSnackbar(error);
        });
    }

    private isValidationRequired(form: any, willDefaultValidationApply: boolean): boolean {
        if (willDefaultValidationApply ||
            (form.address != "" || form.benefit != 0 || form.city != "" || form.country != "US" || form.dob != null || form.emailAddress != ""
                || form.firstName != "" || form.initials != "" || form.isIndividual != true || form.isInsured != true || form.lastName != ""
                || form.phone != "" || form.relationship != "" || form.ssn != "" || form.state != "" || form.trustName != "" || form.zipCode != "")) {
            return true;
        }
        else {
            return false;
        }
    }

    isSsnUniqueInList(): boolean {
        let result = true;
        let arrSsn = [];

        this.primaryFormValue.forEach(x => {

            if (x.ssn != "")
                arrSsn.push(x.ssn);
        });

        this.contingentFormValue.forEach(x => {
            if (x.ssn != "")
                arrSsn.push(x.ssn);
        });

        arrSsn.forEach(element => {
            if (arrSsn.filter(x => x == element).length > 1)
                result = false;
        });

        if (!result)
            this.message = this.config.getConfig("ssnUnique");
        else
            this.message = "";

        return result;
    }


    // validate primary beneficiary validations
    private validatePrimaryBeneficiary() {
        for (var i = 0; i < this.primaryBenefModel.length; i++) {
            let componentId = this.primaryBenefModel[i].key;
            if (this.newBeneficiaryChild.beneficiaryInfoForm.valid) {
                this.isPrimaryBenfFormValid = this.isPrimaryBeneficiaryValid(this.primaryBenefModel[i].value);
                this.primaryValidations.set(componentId, this.isPrimaryBenfFormValid);
                if (this.isPrimaryBenfFormValid) {
                    break;
                }
            }
            else {
                this.isPrimaryBenfFormValid = false;
                this.primaryValidations.set(componentId, this.isPrimaryBenfFormValid);
            }
        }
    }

    // check if all reuired fields of primary benficiary are valid
    private isPrimaryBeneficiaryValid(value: any): boolean {
        if (value.address != "" || value.benefit != 0 || value.city != "" || value.country != "US" || value.dob != null || value.firstName != ""
            || value.lastName != "" || value.relationship != "" || value.ssn != "" || value.state != "" || value.trustName != "" || value.zipCode != "") {
            return true;
        }
        else { return false; }
    }
}
