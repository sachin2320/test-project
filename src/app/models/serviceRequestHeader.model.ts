export class ServiceRequestHeaderModel {
    constructor(public owner: string = "",
        public policyNumber: string = "",
        public email: string = "",
        public phone: string = "",
        public serviceName: string = "",
        public noneViewOnlyHeaderText: string = "",
        public viewOnlyHeaderText: string = "",
        public helpHtmlText: string = "",
        public serviceType: string = "",
        public showSsn: boolean = false,
        public ssn: string = "",
        public showAddress: boolean = false,
        public address: string = "") {
    }
}