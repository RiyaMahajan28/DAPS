import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService   
  ) {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],  
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const data = {
        emp_code: this.loginForm.value.username,
        emp_password: this.loginForm.value.password
      };

      this.api.login(data).subscribe({
        next: (res: any) => {
          console.log('Login success:', res);

          //  Example: save emp_id and companyId for later use
           sessionStorage.setItem('emp_id', res.user.emP_ID);
          // sessionStorage.setItem('companyId', res.companyId);

          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Login failed:', err);
        }
      });
    }
  }


}
