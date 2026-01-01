import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-state',
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.css'
})
export class AddStateComponent implements OnInit {

stateForm!: FormGroup;
stateId: number | null = null;
isEdit = false;
clients: any[] = [];
  constructor(
  private fb: FormBuilder,
  private api: ApiService,
  private router: Router,
  private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  this.stateForm = this.fb.group({
    clientId: ['', Validators.required],
    zoneName: ['', Validators.required],
    zoneshortCode: ['',[Validators.required, Validators.maxLength(2),Validators.minLength(2)]],
    zonestatus: [''],
    email: ['', [Validators.email]]
  });

  this.api.getClients().subscribe({
  next: (res: any) => {
    this.clients = res?.data || [];
  },
  error: () => {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load clients' });
  }
});

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.stateId = +id;
      this.isEdit = true;
      this.loadStateById(this.stateId);
    }
  });
}

loadStateById(id: number) {
  this.api.getClientZone().subscribe({
    next: (res: any) => {
      const list = res?.data || [];

      const state = list.find((z: any) => z.zoneId === id);

      if (state) {
        this.stateForm.patchValue({
          
          clientId: state.clientId,
          zoneName: state.zoneName,
          zoneshortCode: state.zoneshortCode,
          zonestatus: state.zonestatus
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Not found', text: 'State not found' });
      }
    },
  error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load state' })
  });
}


//   onSave() {
//   if (this.stateForm.invalid) {
//     this.stateForm.markAllAsTouched();
//     return;
//   }

//   const payload = {
//     ...this.stateForm.value,
//     zonecreated_by: Number(sessionStorage.getItem('emp_id')) || 1,
//     rsemail: 1,
//     zoneId: this.stateId
//   };

//   if (this.isEdit) {
//     this.api.updateClientZone(payload).subscribe({
//       next: () => {
//         alert('State updated successfully');
//         this.router.navigate(['/state-list']);
//       },
//       error: () => alert('Failed to update state')
//     });
//   } else {
//     this.api.insertClientZone(payload).subscribe({
//       next: () => {
//         alert('State added successfully');
//         this.router.navigate(['/state-list']);
//       },
//       error: () => alert('Failed to add state')
//     });
//   }
// }

onSave() {
  if (this.stateForm.invalid) {
    this.stateForm.markAllAsTouched();
    return;
  }

  const empId = Number(sessionStorage.getItem('emp_id')) || 1;

  if (this.isEdit) {

    const payload = {
      zoneId: this.stateId,
      clientId: this.stateForm.value.clientId,
      zoneName: this.stateForm.value.zoneName,
      zoneshortCode: this.stateForm.value.zoneshortCode,
      zonestatus: this.stateForm.value.zonestatus,
      rsemail: Number(sessionStorage.getItem('emp_id')) || 1,
      zonecreated_by: empId
    };

    this.api.updateClientZone(payload).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Updated', text: 'State updated successfully' });
        this.router.navigate(['/state-list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update state' });
      }
    });

  } else {
    
    const payload = {
      clientId: this.stateForm.value.clientId,
      zoneName: this.stateForm.value.zoneName,
      zoneshortCode: this.stateForm.value.zoneshortCode,
      zonestatus: this.stateForm.value.zonestatus,
      zonecreated_by: empId,
      rsemail: Number(sessionStorage.getItem('emp_id')) || 1
    };

    this.api.insertClientZone(payload).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Saved', text: 'State added successfully' });
        this.router.navigate(['/state-list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add state' });
      }
    });
  }
}



  goBack() {
    this.router.navigate(['/state-list']);
  }
}
