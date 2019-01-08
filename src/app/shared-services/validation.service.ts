import { FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Number } from 'core-js/library/web/timers';


export class Validation {
    public static pwdReg: any = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{10,128}$/;
    // public static zipCodeReg: any = /^\d{5}(?:[-\s])?$/;
    public static zipCodeReg: any = /^\d{5}(?:[-\s]\d{4})?$/;
    public static zipCodeRegNonUS: any = /^[A-Za-z0-9\d- ]{5,12}$/;

    public static ssnReg: any = /^\d{3}\-?\d{2}\-?\d{4}$/;
    //public static emailReg: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public static emailReg: any = /^([a-zA-Z0-9_\-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-\+]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    public static ssnDigitReg: any = /^\d{4}$/;
    public static phoneNumberReg: any = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    public static phoneExtReg: any = /^\d{1,5}$/;
    public static userIdReg: any = /^(?=.{8,50}$)[a-zA-Z0-9|#|$|_|@|.]*$/;
    public static dobReg: any = /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d/;
    public static decimalReg: any = /^([0-9]{1,15})(([.]{0,1})([0-9]{0,2}))?$/;
    public static threeDecimalDigitReg: any = /^([1-9]{1}[0-9]*\.?[0-9]{1,2}|[0]{1}\.[0-9]{1,2}|[1-9]{1}[0-9]*\.{0})$/; //ALM #397
    public static percentReg: any = /^(?:100(?:\.00?)?|\d?\d(?:\.\d\d?)?)$/;
    // public static percentReg: any = /^(100|100.0|100.00)$|^[0-9]{0,2}$|^[0-9]{0,2}[.][0-9]{1,2}$/;
    public static countryCodeReg: any = /^[+]{0,1}[0-9]{1,6}$/;
    // public static phoneNumberChkReg: any = /^([+]{0,1}([2-9]|[1-9][0-9]|[1-9][0-9][0-9]) (\d[ ]?){4,22})$|^((\+1){0,1}[1-9]{0,3}[-, ]{0,1}[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}( x[0-9]{1,5})?)$/;
    public static phoneNumberChkReg: any = /^([+]{0,1}([2-9]|[1-9][0-9]|[1-9][0-9][0-9]) (\d[ ]?){4,22})$|^((\+1){0,1}[1-9]{0,3}[-, ]{0,1}[0-9]{3}[-]{1}[0-9]{3}[-]{1}[0-9]{4}( x[0-9]{1,5})?)$|^[1-9]{1}[0-9]{9}$/;

    public static numericWithSpecialCharReg: any = /[^0-9]/g;
    public static numericWithSpecialCharRegWithZero: any = /[^1-9]/g;
    public static overNightDelayAccountNumber: any = /^[a-zA-Z0-9 -]{6,20}$/;
    public static carrierName: any = /^[a-zA-Z ]{3,25}$/;
    public static greaterThanOrEq100: any = /^([1-9]\d\d|[1-9]\d{3,})$/;
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': `Required field`,
            'invalidEmailAddress': `Invalid email address`,
            'invalidZip': `Invalid zip`,
            'invalidSSN': `Invalid SSN number`,
            'ssnNotMatch': `Ssn and ConfirmSsn doesn't match`,
            'invalidPassword': `Invalid password. Password must be at least 6 characters long and must have one number, one special character, one upper case and one lower case.`,
            'minlength': `Minimum ${validatorValue.requiredLength} digits required`,
            'invalidConfirmEmail': `Email and Confirm email doesn't match.`,
            'ssnDigitOnly': `Only number and 4 chars allow`,
            'invalidConfirmPassword': `Password and Confirm password doesn't match.`,
            'invalidPhone': `Invalid phone number`,
            'decimalReg': `Maximum of 15,2 decimals are allowed.`,
            'percentReg': `Value should be within 1-100, only 2 decimal places allowed.`
        };
        return config[validatorName];
    }

    static MatchControlValues(primaryControl: AbstractControl, confirmControl: AbstractControl, isValidationCaseSensitive: boolean = true) {
        let primaryControlValue = primaryControl.value;
        let confirmControlValue = confirmControl.value;

        if ((primaryControlValue == "" && confirmControlValue != "") ||
            (primaryControlValue != "" && confirmControlValue == "") ||
            (primaryControlValue && confirmControlValue && (isValidationCaseSensitive ? (primaryControlValue != confirmControlValue) : (primaryControlValue.toLowerCase() != confirmControlValue.toLowerCase())))) {
            confirmControl.setErrors({ confirmControlNotMatch: true });
        } else {
            let err = confirmControl.errors;
            if (err != null) {
                if (err.confirmControlNotMatch == true)
                    confirmControl.setErrors(null);
                else
                    confirmControl.setErrors(err);
            }
            else {
                confirmControl.setErrors(null);
            }
            return null;
        }
    }

    static ValidateNotEqual(primaryControl: AbstractControl, confirmControl: AbstractControl, isValidationCaseSensitive: boolean = true) {
        let primaryControlValue = primaryControl.value;
        let confirmControlValue = confirmControl.value;

        if ((primaryControlValue == "" || confirmControlValue == "") || (
            primaryControlValue && confirmControlValue && (isValidationCaseSensitive ?
                (primaryControlValue == confirmControlValue) :
                (primaryControlValue.toLowerCase() == confirmControlValue.toLowerCase())))) {
            confirmControl.setErrors({ confirmControlNotMatch: false });
        } else {
            let err = confirmControl.errors;
            if (err != null) {
                if (err.confirmControlNotMatch == true)
                    confirmControl.setErrors(null);
                else
                    confirmControl.setErrors(err);
            }
            else {
                confirmControl.setErrors(null);
            }
            return null
        }
    }

    static ValidateForm(FG: FormGroup) {
        if (FG != undefined && FG != null) {
            let controls = FG.controls;
            for (var i in controls) {
                controls[i].updateValueAndValidity();
            }
        }
    }

    // This function will be used to compare input data from provided value. 
    //Input data should be greater than or equal to value provided.
    static ValidateValueGreaterThan(inputControl: AbstractControl, value: number) {
        let data = inputControl.value;;

        if ((data == null || data == ""))
            return null;


        if (parseFloat(data) <= 0) {
            inputControl.setErrors({ inputControlNotValid: true });
        }
        else {

            if (parseFloat(data) >= value) {
                let err = inputControl.errors;
                if (err != null) {
                    if (err.inputControlNotValid == true)
                        inputControl.setErrors(null);
                    else
                        inputControl.setErrors(err);
                }
                else {
                    inputControl.setErrors(null);
                }
            }
            else {
                inputControl.setErrors({ inputControlNotValid: true });
            }
        }
    }

    // This function will be used to compare input date of birth from current date. 
    //Input date should be less than or equal to current date and should be in UTC format.
    static ValidateDob(inputControl: AbstractControl) {
        let inputDate = inputControl.value;
        if (inputDate == null || inputDate == "")
            return null;

        let parsedInputDate = new Date(Date.parse(inputDate));
        if (parsedInputDate.toJSON() == null) {
            inputControl.setErrors({});
        }
        else {
            if (this.ValidateDate(inputDate)) {
                //convert to utc time format
                let currentDate = new Date(new Date().toUTCString());
                let formattedDate = new Date(parsedInputDate.toUTCString());
                //compare current date with input date
                if (currentDate <= formattedDate) {
                    inputControl.setErrors({});
                } else {
                    return null;
                }
            }
            else {
                inputControl.setErrors({});
            }
        }
    }
    //Input date should be greater than or equal to current date and should be in UTC format.
    static ValidateDateGreaterThanCurrent(inputControl: AbstractControl) {
        let inputDate = inputControl.value;
        if (inputDate == null || inputDate == "")
            return null;

        let parsedInputDate = new Date(Date.parse(inputDate));
        if (parsedInputDate.toJSON() == null) {
            inputControl.setErrors({});
        }
        else {
            if (this.ValidateDate(inputDate)) {
                //convert to utc time format
                let years = new Date().getFullYear();
                let month = new Date().getMonth();
                let date = new Date().getDate();
                let today = new Date(years, month, date);
                let currentDate = new Date(today.toUTCString());
                let formattedDate = new Date(parsedInputDate.toUTCString());
                //compare current date with input date
                if (currentDate.toJSON() <= formattedDate.toJSON()) {
                    return null;
                }
                else {
                    inputControl.setErrors({});
                }
            }
            else {
                inputControl.setErrors({});
            }
        }
    }

    //Input date should be greater than or equal to current date and should be in UTC format.
    static ValidateDateGreaterThanCurrentAndWithinNumDays(inputControl: AbstractControl, maxDays: number) {
        let inputDate = inputControl.value;
        if (inputDate == null || inputDate == "")
            return null;

        let parsedInputDate = new Date(Date.parse(inputDate));
        if (parsedInputDate.toJSON() == null) {
            inputControl.setErrors({});
        }
        else {
            if (this.ValidateDate(inputDate)) {
                //convert to utc time format
                let years = new Date().getFullYear();
                let month = new Date().getMonth();
                let date = new Date().getDate();
                let maxDate = new Date().getDate() + maxDays;
                let today = new Date(years, month, date);
                let futureDay = new Date(years, month, maxDate)

                let currentDate = new Date(today.toUTCString());
                let futureDate = new Date(futureDay.toUTCString());
                let formattedDate = new Date(parsedInputDate.toUTCString());
                //compare current date with input date
                if (currentDate.toJSON() <= formattedDate.toJSON() && formattedDate.toJSON() <= futureDate.toJSON()) {
                    return null;
                }
                else {
                    inputControl.setErrors({});
                }
            }
            else {
                inputControl.setErrors({});
            }
        }
    }

    //Input date should be greater than current date and should be in UTC format.
    static ValidateDateGreaterThanNotEqualCurrent(inputControl: AbstractControl) {
        let inputDate = inputControl.value;
        if (inputDate == null || inputDate == "")
            return null;

        let parsedInputDate = new Date(Date.parse(inputDate));
        if (parsedInputDate.toJSON() == null) {
            inputControl.setErrors({});
        }
        else {
            if (this.ValidateDate(inputDate)) {
                //convert to utc time format
                let years = new Date().getFullYear();
                let month = new Date().getMonth();
                let date = new Date().getDate();
                let today = new Date(years, month, date);
                let currentDate = new Date(today.toUTCString());
                let formattedDate = new Date(parsedInputDate.toUTCString());
                //compare current date with input date
                if (currentDate.toJSON() < formattedDate.toJSON()) {
                    return null;
                }
                else {
                    inputControl.setErrors({});
                }
            }
            else {
                inputControl.setErrors({});
            }
        }
    }

    //Input date should be less than current date and should be in UTC format.
    static ValidateDateLessThanCurrent(inputControl: AbstractControl) {
        let inputDate = inputControl.value;
        if (inputDate == null || inputDate == "")
            return null;

        let parsedInputDate = new Date(Date.parse(inputDate));
        if (parsedInputDate.toJSON() == null) {
            inputControl.setErrors({});
        }
        else {
            if (this.ValidateDate(inputDate)) {
                //convert to utc time format
                let years = new Date().getFullYear();
                let month = new Date().getMonth();
                let date = new Date().getDate();
                let today = new Date(years, month, date);
                let currentDate = new Date(today.toUTCString());
                let formattedDate = new Date(parsedInputDate.toUTCString());
                //compare input date with current date
                if (formattedDate.toJSON() < currentDate.toJSON()) {
                    return null;
                }
                else {
                    inputControl.setErrors({});
                }
            }
            else {
                inputControl.setErrors({});
            }
        }
    }

    //Input date should be greater than or equal to provided date and should be in UTC format.
    static ValidateDateGreaterThan(primaryControl: AbstractControl, secondaryControl: AbstractControl) {
        let primaryDate = primaryControl.value;
        let secondaryDate = secondaryControl.value;
        if ((primaryDate == null || primaryDate == "") || (secondaryDate == null || secondaryDate == ""))
            return null;

        let parsedPrimaryInputDate = new Date(Date.parse(primaryDate));
        let parsedSecondaryInputDate = new Date(Date.parse(secondaryDate));
        if (parsedPrimaryInputDate.toJSON() == null) {
            primaryControl.setErrors({ primaryControlNotValid: true });
        }
        else {
            if (this.ValidateDate(primaryDate) && this.ValidateDate(secondaryDate)) {
                //convert to utc time format

                let formattedSecondaryDate = new Date(parsedSecondaryInputDate.toUTCString());
                let formattedPrimaryDate = new Date(parsedPrimaryInputDate.toUTCString());
                //compare Secondary date with primary date
                if (formattedPrimaryDate.toJSON() > formattedSecondaryDate.toJSON()) {
                    let err = primaryControl.errors;
                    if (err != null) {
                        if (err.primaryControlNotValid == true)
                            primaryControl.setErrors(null);
                        else
                            primaryControl.setErrors(err);
                    }
                    else {
                        primaryControl.setErrors(null);
                    }
                }
                else {
                    primaryControl.setErrors({ primaryControlNotValid: true });
                }
            }
            else {
                primaryControl.setErrors({ primaryControlNotValid: true });
            }
        }
    }
    //Input date should be lesser than or equal to provided date and should be in UTC format.
    static ValidateDateLesserThan(primaryControl: AbstractControl, secondaryControl: AbstractControl) {
        let primaryDate = primaryControl.value;
        let secondaryDate = secondaryControl.value;
        if ((primaryDate == null || primaryDate == "") || (secondaryDate == null || secondaryDate == ""))
            return null;

        let parsedPrimaryInputDate = new Date(Date.parse(primaryDate));
        let parsedSecondaryInputDate = new Date(Date.parse(secondaryDate));
        if (parsedPrimaryInputDate.toJSON() == null) {
            primaryControl.setErrors({ primaryControlNotValid: true });
        }
        else {
            if (this.ValidateDate(primaryDate) && this.ValidateDate(secondaryDate)) {
                //convert to utc time format

                let formattedSecondaryDate = new Date(parsedSecondaryInputDate.toUTCString());
                let formattedPrimaryDate = new Date(parsedPrimaryInputDate.toUTCString());
                //compare Secondary date with primary date
                if (formattedSecondaryDate.toJSON() > formattedPrimaryDate.toJSON()) {
                    let err = primaryControl.errors;
                    if (err != null) {
                        if (err.primaryControlNotValid == true)
                            primaryControl.setErrors(null);
                        else
                            primaryControl.setErrors(err);
                    }
                    else {
                        primaryControl.setErrors(null);
                    }
                }
                else {
                    primaryControl.setErrors({ primaryControlNotValid: true });
                }
            }
            else {
                primaryControl.setErrors({ primaryControlNotValid: true });
            }
        }
    }

    static ValidateRequiredWithNoEmptySpaceInput(control: AbstractControl) {
        if (!(!control.value) && control.value.trim() == "") {
            return { nospace: true };
        }
        else {
            if (Validators.required(control) == null)
                return null;
            else
                return { required: true };
        }
    }

    static ValidateNumericWithNoAllZeroInput(control: AbstractControl) {
        if (!(!control.value) && parseFloat(control.value.replace(Validation.numericWithSpecialCharReg, "")) == 0)
            return { allDigitsZero: true };
        else
            return null;
    }

    static ValidateNumericWithAllZeroInput(control: AbstractControl) {
        if (!(!control.value) && parseFloat(control.value.replace(Validation.numericWithSpecialCharRegWithZero, "")) == 0)
            return { allDigitsWithZero: true };
        else
            return null;
    }

    //This function will be used to validate zip code on country selection.
    static ValidateZipCodeAsPerCountrySelected(control: AbstractControl, countryCode: string) {
        let maxLength: number = 10; // 5; 
        control.setValidators(null);
        control.setErrors(null);
        if (countryCode != "US") {
            maxLength = 12;
            control.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.zipCodeRegNonUS),
            Validation.ValidateNumericWithNoAllZeroInput]);
        }
        else {
            control.setValidators([Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.zipCodeReg),
            Validation.ValidateNumericWithNoAllZeroInput]);
        }
        return maxLength;
    }

    //This function will be used to validate phone number on country selection.
    static ValidatePhoneNumberAsPerCountrySelected(control: AbstractControl, countryCode: string) {
        control.setValidators(null);
        control.setErrors(null);
        if (countryCode == "US") {
            control.setValidators([Validators.pattern(Validation.phoneNumberChkReg), Validation.ValidateNumericWithNoAllZeroInput]);
        }
        else {
            control.setValidators([Validators.pattern(Validation.phoneNumberChkReg), Validation.ValidateNumericWithNoAllZeroInput]);
        }
    }

    static ValidateDate(inputDate: string) {

        // Match the date format through regular expression  
        if (inputDate.match(this.dobReg)) {

            // Extract the string into month, date and year  

            var pdate = inputDate.split('/');

            var mm = parseInt(pdate[0]);
            var dd = parseInt(pdate[1]);
            var yy = parseInt(pdate[2]);
            // Create list of days of a month [assume there is no leap year by default]  
            var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (mm == 1 || mm > 2) {
                if (dd > ListofDays[mm - 1]) {
                    return false;
                }
                else {
                    return true;
                }
            }
            if (mm == 2) {
                var lyear = false;
                if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
                    lyear = true;
                }
                if ((lyear == false) && (dd >= 29)) {
                    return false;
                }
                else if ((lyear == true) && (dd > 29)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        else {
            return false;
        }

    }

    static ValidateOldAndNewPhoneNotMatch(oldControl: AbstractControl, newControl: AbstractControl) {
        let oldControlValue = oldControl.value;
        let newControlValue = newControl.value;

        if (oldControlValue && newControlValue && (oldControlValue.trim().replace(/[+-]/g, "").replace(/^[0]+/g, "") == newControlValue.trim().replace(/[+-]/g, "").replace(/^[0]+/g, ""))) {
            newControl.setErrors({ newControlMatch: true });
        } else {
            let err = newControl.errors;
            if (err != null) {
                if (err.newControlMatch == true)
                    newControl.setErrors(null);
                else
                    newControl.setErrors(err);
            }
            else {
                newControl.setErrors(null);
            }
            return null
        }
    }

    static ValidateControlValuesGreaterThanZero(federalIncomeTaxControl: AbstractControl, stateIncomeTaxControl: AbstractControl,
        currencySignFederalIncomeTaxControl: AbstractControl,
        currencySignStateIncomeTaxControl: AbstractControl) {
        let federalIncomeTaxControlValue = federalIncomeTaxControl.value;
        let stateIncomeTaxControlValue = stateIncomeTaxControl.value;

        if ((federalIncomeTaxControlValue == 0 && stateIncomeTaxControlValue == 0) ||
            (federalIncomeTaxControlValue == "" && stateIncomeTaxControlValue == 0) ||
            (federalIncomeTaxControlValue == 0 && stateIncomeTaxControlValue == "")) {
            if (currencySignFederalIncomeTaxControl.value == "%") {
                federalIncomeTaxControl.setErrors({ ControlValuesSumEqualsZero: true });
            }
            if (currencySignStateIncomeTaxControl.value == "%") {
                stateIncomeTaxControl.setErrors({ ControlValuesSumEqualsZero: true });
            }
            if (currencySignFederalIncomeTaxControl.value == "$" && currencySignStateIncomeTaxControl.value == "$") {
                federalIncomeTaxControl.setErrors({ ControlValuesSumEqualsZero: true });
                stateIncomeTaxControl.setErrors({ ControlValuesSumEqualsZero: true });
            }
        } else {           
            if (federalIncomeTaxControlValue != null) {
                federalIncomeTaxControl.setErrors(null);
            }
            if (stateIncomeTaxControlValue != null) {
                stateIncomeTaxControl.setErrors(null);
            }
            return this.setIncomeTaxControlErrors(federalIncomeTaxControl, stateIncomeTaxControl);
        }
    }

    static ValidateControlValuesLessThanHundred(federalIncomeTaxControl: AbstractControl, stateIncomeTaxControl: AbstractControl,
        currencySignFederalIncomeTaxControl: AbstractControl,
        currencySignStateIncomeTaxControl: AbstractControl) {
        let federalIncomeTaxControlValue = federalIncomeTaxControl.value || 0;
        let stateIncomeTaxControlValue = stateIncomeTaxControl.value || 0;
        let sumOfControlValues = 0;

        if (currencySignFederalIncomeTaxControl.value == "%") {
            sumOfControlValues = sumOfControlValues + parseFloat(federalIncomeTaxControlValue);
        }
        if (currencySignStateIncomeTaxControl.value == "%") {
            sumOfControlValues = sumOfControlValues + parseFloat(stateIncomeTaxControlValue);
        }

        if (sumOfControlValues > 100) {
            if (currencySignFederalIncomeTaxControl.value == "%") {
                federalIncomeTaxControl.setErrors({ ControlValuesSumGreaterThanHundred: true });
            }
            if (currencySignStateIncomeTaxControl.value == "%") {
                stateIncomeTaxControl.setErrors({ ControlValuesSumGreaterThanHundred: true });
            }
        } else {
            return this.setIncomeTaxControlErrors(federalIncomeTaxControl, stateIncomeTaxControl);
        }
    }

    static setIncomeTaxControlErrors(federalIncomeTaxControl: AbstractControl, stateIncomeTaxControl: AbstractControl) {
        let errFederalIncomeTaxControl = federalIncomeTaxControl.errors;
        if (errFederalIncomeTaxControl != null) {
            if (errFederalIncomeTaxControl.ControlValuesSumGreaterThanHundred == true)
                federalIncomeTaxControl.setErrors(null);
            else
                federalIncomeTaxControl.setErrors(errFederalIncomeTaxControl);
        }
        else {
            federalIncomeTaxControl.setErrors(null);
        }

        let errStateIncomeTaxControl = stateIncomeTaxControl.errors;
        if (errStateIncomeTaxControl != null) {
            if (errStateIncomeTaxControl.ControlValuesSumGreaterThanHundred == true)
                stateIncomeTaxControl.setErrors(null);
            else
                stateIncomeTaxControl.setErrors(errStateIncomeTaxControl);
        }
        else {
            stateIncomeTaxControl.setErrors(null);
        }
        return null;
    }
}
