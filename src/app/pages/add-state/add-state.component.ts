import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-state',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.css'
})
export class AddStateComponent implements OnInit {

  stateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stateForm = this.fb.group({
      clientId: ['', Validators.required],
      zoneName: ['', Validators.required],
      zoneshortCode: ['', Validators.required],
      zonestatus: ['Y']   // default Active
    });
  }

  onSave() {
    if (this.stateForm.invalid) {
      this.stateForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.stateForm.value,
      zonecreated_by: Number(sessionStorage.getItem('emp_id')) || 1,
      rsemail: 1
    };

    this.api.insertClientZone(payload).subscribe({
      next: () => {
        alert('State added successfully');
        this.router.navigate(['/state-list']);
      },
      error: () => {
        alert('Failed to add state');
      }
    });
  }

  goBack() {
    this.router.navigate(['/state-list']);
  }
}
