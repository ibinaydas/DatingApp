import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

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
  private toastrService = inject(ToastrService);

  public onRegister() {
    this.accountService.registerUser(this.model).subscribe({
      next: (res) => {
        console.log(res);
        this.onCancel();
      },
      error: (e) => {
        this.toastrService.error(Array.isArray(e) ? e.join('<br />') : e, undefined, { enableHtml: true });
      }
    });
  }

  public onCancel() {
    this.cancel.emit();
  }
}
