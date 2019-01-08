import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";

@Injectable()
export class ErrorService {

    handleError(error: any) {
        let errMsg: string = "";
        if (error.status && error.status == 401)
            errMsg = "User name or password is incorrect.";
        else {
            if (error._body) {
                try {
                    var errorObject = JSON.parse(error._body);
                    if (errorObject.error_description)
                        errMsg = errorObject.error_description;
                    if (errorObject.message && !errMsg)
                        errMsg = errorObject.message;
                    if (errorObject.error)
                        errMsg = errorObject.error;
                }
                catch (ex) {
                    errMsg = 'Server error';
                }
            }

            if (!errMsg) {
                errMsg = error.message || 'Server error';
            }
        }
        return Observable.throw(errMsg);
    }
}