import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  public model: any = {};
  public accountService = inject(AccountService);

  ngOnInit() { }

  public onLogin() {
    this.accountService.loginUser(this.model).subscribe({
      next: (n) => console.log(n),
      error: (e) => console.error(e)
    });
  }

  public onLogout() {
    this.accountService.logoutUser();
  }
}
