export class ServiceRequestCommentModel {
    constructor(
        public commentId: number = 0,
        public commentBy: string = "",
        public commentDate: Date = null,
        public description: string = "") { }
}