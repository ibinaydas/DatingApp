import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { AccountService } from './services/account.service';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, NavBarComponent, HomeComponent]
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);

  ngOnInit() {
    this.setCurrentUser();
  }

  private setCurrentUser() {
    const currentUser = localStorage.getItem('dAUser');
    if (currentUser) {
      const parsedObj = JSON.parse(currentUser);
      this.accountService.currentUser.set(parsedObj);
    }
  }
}
