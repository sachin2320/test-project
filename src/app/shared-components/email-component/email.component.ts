import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'email',
    styles: [],
    templateUrl: './email.component.html'
})

export class EmailComponent implements OnInit {

    formGroup: FormGroup = null;
    public oldEmail: string = "";
    public subscribe: any;

    @Input('currentEmailPlaceholder') currentEmailPlaceholder: string = "Current email";
    @Input('newEmailPlaceholder') newEmailPlaceholder: string = "New email";
    @Input('confirmEmailPlaceholder') confirmEmailPlaceholder: string = "Confirm new email";

    @Input('showCurrentEmail') showCurrentEmail: boolean = false;
    @Input('showIsEmailPrimarySection') showIsEmailPrimarySection: boolean = false;


    @Output('onComponentValidated')
    dataIsValid = new EventEmitter();

    @Output('emailComponentValueChanged')
    formValue = new EventEmitter();

    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {       
        this.subscribe = this.route.queryParams.subscribe(params => {
            this.oldEmail = params["email"];
        });
    }

    ngOnInit(): void {
        this.setupFormGroup();
        this.setupEventEmitter();
        this.formGroup.controls["isPrimaryEmail"].setValue("false");
    }

    setupFormGroup() {
        this.formGroup = this.formBuilder.group({
            currentEmail: [this.oldEmail, (this.showCurrentEmail ? [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.pattern(Validation.emailReg)] : null)],
            email: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.email, Validators.pattern(Validation.emailReg)]],
            confirmEmail: ['', [Validation.ValidateRequiredWithNoEmptySpaceInput, Validators.email]],
            isPrimaryEmail: []
        }, {
                validator: (group: FormGroup) => {
                    group.controls.email.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.email, group.controls.confirmEmail, false);
                        // Validation.ValidateNotEqual(group.controls.email, group.controls.currentEmail, false);
                    });
                    group.controls.confirmEmail.valueChanges.subscribe(() => {
                        Validation.MatchControlValues(group.controls.email, group.controls.confirmEmail, false);
                        // Validation.ValidateNotEqual(group.controls.confirmEmail, group.controls.currentEmail, false);
                    });
                }
            });
    }

    setupEventEmitter() {
        this.formGroup.valueChanges.subscribe(form => {
            let isValid = this.formGroup.valid;
            this.dataIsValid.emit({ FormIsValid: isValid });
            this.formValue.emit({ FormIsValid: isValid, FormData: form });
        });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }
}