import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.css']
})
export class UserUploadComponent {
  uploadForm: FormGroup;
  responseMsg: string = '';
  isSuccess: boolean | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.uploadForm = this.fb.group({
      emp_id: ['', Validators.required],
      pan_card_file: [null, Validators.required],
      adhar_card_file: [null, Validators.required]
    });
  }

  onFileChange(event: any, controlName: string) {
    if (event.target.files.length > 0) {
      this.uploadForm.patchValue({ [controlName]: event.target.files[0] });
    }
  }

  submit() {
    if (this.uploadForm.invalid) return;
    const formData = new FormData();
    formData.append('EMP_ID', this.uploadForm.value.emp_id);
    formData.append('pan_card_file', this.uploadForm.value.pan_card_file);
    formData.append('adhar_card_file', this.uploadForm.value.adhar_card_file);
    this.api.uploadAdharPan(formData).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          Swal.fire({ 
            icon: 'success', 
            title: 'Uploaded', 
            text: res.message || 'Documents uploaded successfully' 
          });
        } else {
          Swal.fire({ 
            icon: 'error', 
            title: 'Upload Failed', 
            text: res.message || 'Upload failed' 
          });
        }
        this.isSuccess = res.isSuccess;
        this.responseMsg = res.message;
      },
      error: () => {
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: 'Upload failed. Please try again.' 
        });
        this.isSuccess = false;
        this.responseMsg = 'Upload failed.';
      }
    });
  }
}
