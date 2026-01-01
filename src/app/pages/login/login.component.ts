import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-login',
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
          // Save emp_id and show success popup
          sessionStorage.setItem('emp_id', res.user.emP_ID);
          Swal.fire({ icon: 'success', title: 'Login successful', text: 'Welcome!' }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        error: (err: any) => {
          console.error('Login failed:', err);
          const msg = err?.error?.message || err?.message || 'Invalid credentials';
          Swal.fire({ icon: 'error', title: 'Login failed', text: msg });
        }
      });
    }
  }


}
