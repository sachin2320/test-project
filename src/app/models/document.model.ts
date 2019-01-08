export class DocumentModel {
    constructor(public documentTitle: string,
        public policyNo: string = "",
        public docIconName: string = "",
        public redirectUrl: string = "",
        public cssClasses: string = "") {
    }
}