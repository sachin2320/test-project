export class ServiceRequestDisclosureModel {
    constructor(public disclosureText: string,
        public isDisclosureAccepted: boolean,
        public displayOrder: number) {
    }
}