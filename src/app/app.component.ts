import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { EmailValidationService } from './email-validator.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  fg!: FormGroup;
  regexAlfa = /^[a-zA-Z]+$/;
  regexCorreo = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
  regexNum = /^\d{1,2}$/;

  nameRequired = true;
  ageRequired = true;
  dobRequired = true;
  emailRequired = true;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailValidationService
  ) {}

  ngOnInit() {
    this.createFrom();
  }

  createFrom(){
    this.fg = this.fb.group({
      name: ['',
        this.nameRequired ? [ Validators.required,
          Validators.minLength(5),
          Validators.pattern(this.regexAlfa)] : []
      ],
      email: ['',
        { validators: this.emailRequired ? [ Validators.required,
          Validators.pattern(this.regexCorreo)] : [],
          asyncValidators: this.emailAsyncValidator.bind(this),
        }],
      age: ['',
        this.ageRequired ? [ Validators.required,
          Validators.pattern(this.regexNum)] : []
        ],
      dob: ['',
        this.dobRequired ? [Validators.required] : []
      ]
    });
  }

  emailAsyncValidator(control: AbstractControl){
    return this.emailService.validateEmail(control.value)
  }

  sNameRequired(){
    this.nameRequired = !this.nameRequired
    this.updateValidators('name');
  }

  sAgeRequired() {
    this.ageRequired = !this.ageRequired;
    this.updateValidators('age');
  }

  sDOBRequired() {
    this.dobRequired = !this.dobRequired;
    this.updateValidators('dob');
  }

  sEmailRequired() {
    this.emailRequired = !this.emailRequired;
    this.updateValidators('email');
  }

  updateValidators(field: 'name' | 'email' | 'age' | 'dob') {
    const control = this.fg.get(field)
    if (!control) return

    switch(field) {
      case 'name':
        control.setValidators(this.nameRequired ? [Validators.required, Validators.minLength(5), Validators.pattern(this.regexAlfa)] : []);
        break;
      case 'email':
        control.setValidators(this.emailRequired ? [Validators.required, Validators.pattern(this.regexCorreo)] : []);
        break;
      case 'age':
        control.setValidators(this.ageRequired ? [Validators.required, Validators.pattern(this.regexNum)] : []);
        break;
      case 'dob':
        control.setValidators(this.dobRequired ? [Validators.required] : []);
        break;
    }
    control.updateValueAndValidity()
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.fg.markAllAsTouched();

    if (this.fg.valid) {
      console.log('Form Data:', this.fg.value);
    } else {
      console.log('Form is invalid');
    }
  }

}
