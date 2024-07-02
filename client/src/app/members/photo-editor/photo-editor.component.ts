import { Component, OnInit, inject, input, output } from '@angular/core';
import { Member } from '../../models/member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { AccountService } from '../../services/account.service';
import { environment } from '../../../environments/environment';
import { MemberService } from '../../services/member.service';
import { ToastrService } from 'ngx-toastr';
import { Photo } from '../../models/photo';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, NgClass, DecimalPipe, FileUploadModule],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  public memberChange = output<Member>();
  public member = input.required<Member>();
  public uploader?: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private baseUrl = environment.apiUrl;

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  public deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo).subscribe(res => {
      const updatedMember = { ...this.member() };
      updatedMember.photos = updatedMember.photos.filter(f => f.id !== photo.id);
      this.memberChange.emit(updatedMember);
      this.toastrService.success('Photo Deleted');
    });
  }

  public setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe(res => {
      const user = this.accountService.currentUser();
      if (user) {
        user.photoUrl = photo.url;
        this.accountService.setCurrentUser(user);
      }
      const updatedMember = { ...this.member() };
      updatedMember.photoUrl = photo.url;
      updatedMember.photos.forEach(p => p.isMain = p.id === photo.id);
      this.memberChange.emit(updatedMember);
      this.toastrService.success('Main Photo Updated');

    });
  }

  private initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/users/add-photo',
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false
    };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = { ...this.member() };
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);
      if (photo.isMain) {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.setCurrentUser(user);
        }
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach(p => p.isMain = p.id === photo.id);
        this.memberChange.emit(updatedMember);
      }
    };
  }
}
