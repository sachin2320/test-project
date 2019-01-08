export class DuplicateServiceRequestModel {
    public constructor(public insuredName: string,
        public policyNumber: string,
        public assignedName: string,
        public assignmentDate: string,
        public address: string,
        public city: string,
        public state: string,
        public zipCode: string
    ) { }
}