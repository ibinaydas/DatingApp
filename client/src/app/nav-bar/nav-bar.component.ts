import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { AccountService } from '../services/account.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  public model: any = {};
  public accountService = inject(AccountService);
  private toastrService = inject(ToastrService);

  ngOnInit() { }

  public onLogin() {
    this.accountService.loginUser(this.model).subscribe({
      next: (n) => console.log(n),
      error: (e) => {
        this.toastrService.error(Array.isArray(e) ? e.join('<br />') : e, undefined, { enableHtml: true });
      },
      complete: () => { this.model = {}; }
    });
  }

  public onLogout() {
    this.accountService.logoutUser();
  }
}
