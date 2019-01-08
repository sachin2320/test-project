import { StateModel } from "app/models/state.model";

export class CountryModel {
    constructor(public id: number = null,
        public code: string = "",
        public name: string = "",
        public states: StateModel[] = []) { }
}