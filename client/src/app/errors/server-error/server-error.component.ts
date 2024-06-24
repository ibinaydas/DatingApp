import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css'
})
export class ServerErrorComponent {
  public error: any;

  constructor(private router: Router) {
    const currentNav = router.getCurrentNavigation();
    this.error = currentNav?.extras?.state?.['error'];
  }
}
