import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RecordsComponent } from "../records/records.component";


@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './record-form.component.html',
  styleUrl: './record-form.component.css'
})
export class RecordFormComponent implements OnInit{
recordForm: FormGroup;
  isEdit = false;
  recordId!: number;
  
 // ✅ Static company list for now (you can fetch from API later)
   companies = [
    { companyId: 1, companyName: 'BizTech Solutions' },
    { companyId: 2, companyName: 'TechNova Systems' },
    { companyId: 3, companyName: 'Innova IT Services' },
    { companyId: 4, companyName: 'BlueWave Technologies' },
    { companyId: 5, companyName: 'CodeCrest Pvt Ltd' }
  ];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.recordForm = this.fb.group({
      clientName: ['', Validators.required],
      shortCode: ['', Validators.required],
      status: ['', Validators.required],
      created_by:[''],
      empannelment: [''],
      companyId:['',Validators.required],
      isEmpannelmentChange:[''],
      clientId:['']
    });
  }


ngOnInit(): void {
  const state = history.state as { recordId?: number };

  if (state?.recordId) {
    this.isEdit = true;
    this.recordId = state.recordId;
    this.loadRecord(this.recordId);
  } else {
    console.log('No recordId found — form is in add mode');
  }
}


  // ✅ Load record by ID
private loadRecord(id: number): void {
  this.api.getClients().subscribe((res: any) => {
    const records = res?.data || [];
    const client = records.find((c: any) => c.clientId === id);

    if (client) {
      const cleanName = client.clientName
        ?.split('-')[0]  
        ?.trim();

      this.recordForm.patchValue({
        ...client,
        clientName: cleanName
      });
    }
  });
}


 

onSave(): void {
  if (!this.recordForm.valid) return;

  const companyId = Number(this.recordForm.value.companyId);

  //  read emp_id
  let empId = sessionStorage.getItem('emp_id');
  let createdBy = 0;

  // Created By logic
  if (empId && !isNaN(Number(empId))) {
    createdBy = Number(empId);
  } else {
    createdBy = 1; // fallback to 1 if not present
    console.warn('emp_id not found in sessionStorage. Using default created_by = 1');
  }

 if (this.isEdit) {
  const body = {
    ...this.recordForm.value,
    clientId: this.recordId,
    isEmpannelmentChange: 'N',
    created_by: createdBy
  };

  this.api.updateClient(body).subscribe({
    next: () => this.router.navigate(['/records']),
    error: err => console.error('Update failed:', err)
  });
}
else {
    const body = {
      ...this.recordForm.value,
      created_by: createdBy,   
      companyId: companyId
    };


    this.api.addClient(body).subscribe({
      next: () => {
        console.log('Client added');
        this.router.navigate(['/records']);
      },
      error: err => console.error('Add failed:', err)
    });
  }
}

goBack(){
  this.router.navigate(['/records'])
}//remove



}

