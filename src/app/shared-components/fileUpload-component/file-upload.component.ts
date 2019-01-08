import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileUpload } from "app/models/fileUpload.model";

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html'
})

export class FileUploadComponent {
    @Input('model') model: FileUpload[] = [];
    @Input('viewonly') viewOnly: boolean = false;
    @Input('maxfilesize') maxFileSize: number = 26214400;
    @Input('isControlDisabled') controlDisabled: boolean = false;
    @Input('showInstructions') showInstructions: boolean = false;
    @Output('onFileSelected')
    onFileSelected = new EventEmitter<FileUpload>();

    @Output('onInvalidFileSelected')
    onInvalidFileSelected = new EventEmitter<string>();

    constructor() { }

    validateSelectedFile(file: File, fileId: any): string {

        let message: string = "";
        let modelFile = this.model[0];
        if (file.type != modelFile.documentFileType) {
            message = "Invalid file type ({0}) selected.".replace("{0}", file.name);
        }
        else if (file.size > this.maxFileSize) {
            message = "The size of the selected file, {0}, is more than the allowed size of {1} MB.".replace("{0}", file.name).replace("{1}", (this.maxFileSize / 1048576).toFixed(0).toString());
        }
        else if (this.model.filter(x => x.id != fileId && x.fileValue != null && x.fileValue.size > this.maxFileSize).length > 0) {
            let filter = this.model.filter(x => x.id != fileId && x.fileValue != null && x.fileValue.size > this.maxFileSize);
            if (filter.length > 0) {
                message = "The size of the selected file, {0}, is more than the allowed size of {1} MB.".replace("{0}", filter[0].fileName).replace("{1}", (this.maxFileSize / 1048576).toFixed(0).toString());
            }
        }
        else if (this.model.filter(x => x.id != fileId && x.fileName == file.name).length > 0) {
            message = "The selected file, {0}, has already been selected.".replace("{0}", file.name);
        }
        return message;
    }

    fileChange(event) {
        if (event.target.files.length > 0) {
            let fileId = event.currentTarget.getAttribute("FileId");
            let file = event.target.files[0];
            let validationResult = this.validateSelectedFile(file, fileId);
            if (validationResult == '') {
                this.onInvalidFileSelected.emit(validationResult);
            }
            else {
                this.onInvalidFileSelected.emit(validationResult);
            }

            let fileName = file.name;
            let filterFile = this.model.filter(x => x.id == fileId);
            if (filterFile.length > 0) {
                filterFile[0].fileValue = file;
                filterFile[0].fileName = fileName;
                this.onFileSelected.emit(filterFile[0]);
            }
        }
    }
}