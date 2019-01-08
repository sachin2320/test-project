export class ServiceRequestFieldDetailModel {
    constructor(public name: string,
        public value: any,
        public groupId: number,
        public groupName: string,
        public groupDisplayOrder: number,
        public displayOrder: number) {
    }
}