import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public cancel = output();
  public model: any = {};
  private accountService = inject(AccountService);

  public onRegister() {
    this.accountService.registerUser(this.model).subscribe(res => {
      console.log(res);
      this.onCancel();
    });
  }

  public onCancel() {
    this.cancel.emit();
  }
}
