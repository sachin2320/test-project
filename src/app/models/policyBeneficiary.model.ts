import { BeneficiaryType } from "app/enums/beneficiary-type.emun";

export class PolicyBeneficiaryModel {
    constructor(public fullName: string,
        public relationshipName: string,
        public percentage: number) { };
}