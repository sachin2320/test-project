
import { Component, Input } from "@angular/core";
import { Validation } from "app/shared-services/validation.service";

@Component({
    selector: 'user-credentialinfo',
    styles: [],
    templateUrl: './credentialInfo.component.html'
})

export class CredentialInfoComponent {
    @Input('credentialinfoform') userInfoForm: any = {};
    @Input('isUserIdVerifying') isUserIdVerifying: boolean = false;
    @Input('isStrongUsername') showUsernameHint: boolean = false;
    @Input('credentialInfoErrorMessage') credentialInfoErrorMessage: string = "";    

    onPasswordComponentValueChanged(event) {
        this.userInfoForm.controls["password"].setValue(event.FormData.password);
        this.userInfoForm.controls["confirmPassword"].setValue(event.FormData.confirmPassword);
        Validation.ValidateForm(this.userInfoForm);
    }

     onEmailComponentValueChanged(event) {
        this.userInfoForm.controls["email"].setValue(event.FormData.email);
        this.userInfoForm.controls["confirmEmail"].setValue(event.FormData.confirmEmail);
        Validation.ValidateForm(this.userInfoForm);
    }
}
