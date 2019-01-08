export class ResponseModel {
    constructor(public success: boolean,
        public errorCode: string,
        public message: string) {
    }
}