export class NavigationStateChangeModel {
    constructor(public pageModel: any = null,
        public hideParentNavigation: boolean = false,
        public isPreviousShow: boolean = false,
        public returnUrl: string = "",
        public isDownloadRequest: boolean = false
    ) {

    }
}