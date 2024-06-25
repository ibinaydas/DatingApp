import { Component, OnInit, inject } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { Member } from '../../models/member';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  public members: Member[] = [];
  private memberService = inject(MemberService);

  ngOnInit() {
    this.loadMembers();
  }

  private loadMembers() {
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
    });
  }
}
