import { Component, OnInit, inject } from '@angular/core';
import { MemberService } from '../../services/member.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  private router = inject(ActivatedRoute);
  private memberService = inject(MemberService);
  public member?: Member;
  public images: GalleryItem[] = [];

  ngOnInit() {
    this.loadMember();
  }

  private loadMember() {
    const memberId = this.router.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberById(+memberId).subscribe(res => {
        this.member = res;
        this.images = res.photos.map(m => new ImageItem({ src: m.url, thumb: m.url }));
      });
    }
  }
}