export class AccountActionModel {
    constructor(
        public firstName: string = "",
        public lastName: string = "",
        public middleName: string = "",
        public address: string = "",
        public city: string = "",
        public state: string = "",
        public zip: string = "",
        public dayTimePhone: string = "",
        public email: string = "") {
    }
}