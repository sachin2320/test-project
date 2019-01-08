export class PolicyDocument {
    constructor(public policy: string,
        public documentId: string,
        public documentName: string,
        public documentType: string,
        public description: string,
        public createdDate: string,
        public tpaId: number) { };
}
