export class FileUpload {
    public constructor(
        public id: number = null,
        public description: string = "",
        public documentFileType: string = "",
        public isActive: boolean = true,
        public fileName: string = "",
        public fileValue: File = null,
        public isRequired: boolean = false) { }
}