import { Component } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser';
import { IpfsService } from "../../services/ipfs.service"
import { FormBuilder, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { GalleryService } from "../../services/gallery.service";

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {
    public uploadFile: any
    public fileSrc: any
    public formError = ''
    public isLoading = false
    public fileTitle: string = ''
    public fileDesc: string = ''

    constructor(
        private ipfs: IpfsService,
        private domSanitizer: DomSanitizer,
        private router: Router,
        private gallery: GalleryService
    ) { }

    public updateFileTitle(title: string): void {
        this.fileTitle = title;
    }

    public updateFileDesc(desc: string): void {
        this.fileDesc = desc;
    }

    public async uploadImage(eventTarget: any) {
        this.uploadFile = eventTarget.files[0]
        this.fileSrc = URL.createObjectURL(this.uploadFile)
        this.fileSrc= this.domSanitizer.bypassSecurityTrustResourceUrl(this.fileSrc);
    }

    public async onSubmit() {
        if (this.uploadFile) {
            this.isLoading = true
            const metaDataUrl = await this.ipfs.uploadFile(this.uploadFile)
            const isItemCreated = await this.gallery.addImage(this.fileTitle, metaDataUrl, this.fileDesc)

            this.isLoading = false
            if (isItemCreated) {
                await this.router.navigate(['/authors-images']);
            }
        } else {
            console.error('form is not valid')
            this.formError = 'Form is not valid'
        }
    }
}
