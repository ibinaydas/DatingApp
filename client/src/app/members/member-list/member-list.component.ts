import { Component, OnInit, inject } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  memberService = inject(MemberService);

  ngOnInit() {
    if (this.memberService.members().length === 0) {
      this.memberService.getMembers();
    }
  }
}
