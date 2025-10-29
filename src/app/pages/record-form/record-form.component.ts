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



//   onSave() {
//     if (this.recordForm.valid) {
//       if (this.isEdit) {
//         const body = {
//           ...this.recordForm.value,
//           clientId: this.recordId,
//           isEmpannelmentChange: 'N',
//           companyId: this.companyId
//         };

//         this.api.updateClient(body).subscribe({
//           next: () => {
//             console.log('Client updated');
//             this.router.navigate(['/records']);
//           },
//           error: err => console.error(err)
//         });
//       } else {
//         const body = {
//           ...this.recordForm.value,
//           created_by: this.emp_id,
//           companyId: this.companyId
//         };

//         this.api.addClient(body).subscribe({
//           next: () => {
//             console.log('Client added');
//             this.router.navigate(['/records']);
//           },
//           error: err => console.error(err)
//         });
//       }
//     }
//   }
// }

//   ngOnInit(): void {
//   // ✅ Check if editing
//     // this.recordId = Number(this.route.snapshot.paramMap.get('id'));
//     // if (this.recordId) {
//     //   this.isEdit = true;
//     //   this.loadRecord(this.recordId);
//     // }
//   }
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
    const records = res?.data || [];   //  take array part
    const client = records.find((c: any) => c.clientId === id);
console.log(client)
    if (client) {
      this.recordForm.patchValue(client);
    }
  });
}

 
// onSave(): void {
//   if (!this.recordForm.valid) return;

//   //const companyId = Number(localStorage.getItem('clientId')); //  number
//   //const companyId=Number(localStorage.getItem('companyId'));
//   const companyId = Number(this.recordForm.value.companyId); 
//   if (this.isEdit) {  
//     console.log(this.recordForm.value)
//     const body = {
//       ...this.recordForm.value,
//       clientId: this.recordId,
//       isEmpannelmentChange: "N",
 
//     };

//     console.log('Update payload:', body);

//     this.api.updateClient(body).subscribe({
//       next: () => {
//         console.log('Client updated');
//         this.router.navigate(['/records']);
//       },
//       error: err => console.error('Update failed:', err)
//     });

//   } else {
//      // ✅ Safely fetch emp_id
//     const empId = localStorage.getItem('emp_id');
//     const createdBy = empId ? Number(empId) : 0; // Default to 0 if null
//     // const createdBy = Number(localStorage.getItem('emp_id')); //  number
//     const body = {
//       ...this.recordForm.value,
//       created_by: createdBy,
//       companyId: companyId
//     };

//     this.api.addClient(body).subscribe({
//       next: () => {
//         console.log('Client added');
//         this.router.navigate(['/records']);
//       },
//       error: err => console.error('Add failed:', err)
//     });
//   }
// }
onSave(): void {
  if (!this.recordForm.valid) return;

  const companyId = Number(this.recordForm.value.companyId);

  // ✅ Safely read emp_id
  let empId = localStorage.getItem('emp_id');
  let createdBy = 0;

  // ✅ Ensure it's always a number
  if (empId && !isNaN(Number(empId))) {
    createdBy = Number(empId);
  } else {
    createdBy = 1; // fallback to 1 if not present
    console.warn('emp_id not found in localStorage. Using default created_by = 1');
  }

  if (this.isEdit) {
    const body = {
      ...this.recordForm.value,
      clientId: this.recordId,
      isEmpannelmentChange: 'N',
      created_by: createdBy  // ✅ make sure it's sent here too
    };


    this.api.updateClient(body).subscribe({
      next: () => {
        console.log('Client updated');
        this.router.navigate(['/records']);
      },
      error: err => console.error('Update failed:', err)
    });

  } else {
    const body = {
      ...this.recordForm.value,
      created_by: createdBy,   // ✅ ensure numeric value
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
}



}

