import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [RegisterComponent]
})
export class HomeComponent {
  public registerMode: boolean = false;

  public registerToggle() {
    this.registerMode = !this.registerMode;
  }
}
