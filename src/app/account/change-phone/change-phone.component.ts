import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { AppConfig } from "app/configuration/app.config";
import { UserPermissionKey } from "app/enums/user-permission-key.enum";
import { UtilityService } from "app/services/helper/utility.service";
import { ForgotPasswordService } from "app/services/registration/forgot-password.service";
import { SpinnerService } from "app/shared-services/spinner.service";
import { Validation } from "app/shared-services/validation.service";

/* This component is used to display "My Profile->Change Phone Number" page */
@Component({
    selector: 'change-phone',
    templateUrl: './change-phone.component.html'
})

export class ChangePhoneComponent implements OnInit {
    public phoneInfoForm: any = {};
    public isPhoneChanged: boolean = false;
    public errorMessage: string = "";
    public successMessage: string = "";
    public subscribe: any;
    public oldPhone: string = "";

    constructor(private formBuilder: FormBuilder,
        private service: ForgotPasswordService,
        private spinner: SpinnerService,
        private route: ActivatedRoute,
        public config: AppConfig,
        private utilityService: UtilityService) {

        this.subscribe = this.route.queryParams.subscribe(params => {
            this.oldPhone = params["phoneNumber"];
        });

        this.phoneInfoForm = this.formBuilder.group({
            currentPhoneNumber: [this.oldPhone, [Validation.ValidateRequiredWithNoEmptySpaceInput]],
            phone: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.phoneNumberChkReg)]],
            confirmPhone: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.phoneNumberChkReg)]],
            isPrimaryContact: []
        }, {
                validator: (group: FormGroup) => {
                    group.controls.phone.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.phone, group.controls.confirmPhone, false);
                        Validation.ValidateOldAndNewPhoneNotMatch(group.controls.currentPhoneNumber, group.controls.phone);
                    });
                    group.controls.confirmPhone.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.phone, group.controls.confirmPhone, false);
                    });
                }
            });
    }

    ngOnInit() {
        this.phoneInfoForm.controls["isPrimaryContact"].setValue("false");
        //If simulated user has no permission to change phone, display error message to user 
        if (!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_phone_key))
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
    }

    changePhone() {
        //If simulated user has no permission to change phone, display error message to user 
        //otherwise allow user to change phone.
        if (!this.utilityService.isSimulatedUserHasPermission(UserPermissionKey.perm_update_phone_key)) {
            this.errorMessage = this.config.getConfig('simulatedUserHasNoPermission');
            return false;
        }

        //Change phone
        this.errorMessage = "";
        this.spinner.start();
        this.service.changePhone(this.phoneInfoForm.value.currentPhoneNumber, this.phoneInfoForm.value.phone, this.phoneInfoForm.value.confirmPhone, this.phoneInfoForm.value.isPrimaryContact)
            .subscribe(res => {
                this.spinner.stop();
                if (res.isSuccess) {
                    this.isPhoneChanged = true;
                    this.successMessage = res.message;
                }
                else {
                    this.errorMessage = res.message;
                }
            },
                error => {
                    this.spinner.stop();
                    this.errorMessage = error;
                });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }
}
