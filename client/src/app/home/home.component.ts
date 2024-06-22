import { Component, OnInit, inject } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [RegisterComponent]
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  public users: any;
  public registerMode: boolean = false;

  ngOnInit() {
    this.getUsers();
  }

  public registerToggle() {
    this.registerMode = !this.registerMode;
  }

  private getUsers() {
    this.http.get('http://localhost:5000/api/users').subscribe(res => {
      this.users = res;
    });
  }
}
