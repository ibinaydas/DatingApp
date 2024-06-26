import { Component, ElementRef, OnInit, inject, ViewChild, HostListener } from '@angular/core';
import { Member } from '../../models/member';
import { MemberService } from '../../services/member.service';
import { AccountService } from '../../services/account.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') public editForm?: NgForm;
  @HostListener('window:beforeunload') public unloadEvent($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  public member?: Member;
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private toastrService = inject(ToastrService);

  ngOnInit() {
    this.loadMember();
  }

  public updateMember() {
    this.memberService.updateMember(this.editForm?.value).subscribe(() => {
      this.toastrService.success('Profile updated successfully');
      this.editForm?.reset(this.member);
    });
  }

  private loadMember() {
    const currentUser = this.accountService.currentUser();
    if (currentUser) {
      this.memberService.getMemberByName(currentUser.username).subscribe(res => {
        this.member = res;
      });
    }
  }
}
