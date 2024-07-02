import { Component, OnInit, inject, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { NgIf } from '@angular/common';
import { TextInputComponent } from "../forms/text-input/text-input.component";
import { DatePickerComponent } from '../forms/date-picker/date-picker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [ReactiveFormsModule, NgIf, TextInputComponent, DatePickerComponent]
})
export class RegisterComponent implements OnInit {
  public cancel = output();
  public maxDate = new Date();
  public validationErrors?: string[];
  public registerForm: FormGroup = new FormGroup({});
  private accountService = inject(AccountService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit() {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  public onRegister() {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({ dateOfBirth: dob });
    this.accountService.registerUser(this.registerForm.value).subscribe({
      next: (res) => {
        this.router.navigateByUrl('/members');
      },
      error: (e) => {
        this.validationErrors = e;
      }
    });
  }

  public onCancel() {
    this.cancel.emit();
  }

  private initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', { validators: Validators.required }],
      password: ['', { validators: [Validators.required, Validators.minLength(4), Validators.maxLength(8)] }],
      confirmPassword: ['', { validators: [Validators.required, this.matchValue('password')] }],
      gender: ['male'],
      knownAs: ['', { validators: Validators.required }],
      dateOfBirth: ['', { validators: Validators.required }],
      city: ['', { validators: Validators.required }],
      state: ['', { validators: Validators.required }],
      country: ['', { validators: Validators.required }]
    });
    this.registerForm.controls['password'].valueChanges.subscribe(v => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  private matchValue(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { noMatch: true };
    };
  }

  private getDateOnly(dob: string) {
    if (dob) {
      return new Date(dob).toISOString().slice(0, 10);
    }
    return undefined;
  }
}
