import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { DynamicField } from '../../models/form-field.model';
import { UiBuilderComponent } from '../ui-builder/ui-builder.component';

@Component({
  selector: 'app-editable-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiBuilderComponent],
  templateUrl: './editable-form.component.html',
  styleUrls: ['./editable-form.component.css']
})
export class EditableFormComponent implements OnInit {
  form!: FormGroup;
  schema: DynamicField[] = [];
  editMode = false;

  // store multiple submissions under this key
  private storageKey = 'editableForm_submissions';

  submissions: Array<{ schema: DynamicField[]; values: any; createdAt: number }> = [];
  selectedIndex: number | null = null;
  showFormModal = false;

  constructor(private dfService: DynamicFormService) {}

  ngOnInit(): void {
    // Load saved schema/values from sessionStorage if present
    try {
      const raw = sessionStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.submissions = parsed;
        } else if (parsed && parsed.schema) {
          // backward compatibility: single saved object
          this.submissions = [{ schema: parsed.schema, values: parsed.values || {}, createdAt: Date.now() }];
        }
      }
      // if submissions exist, select the first by default
      if (this.submissions.length > 0) {
        this.selectSubmission(0);
      }
    } catch (err) {
      console.warn('Failed to load saved editable form', err);
      this.schema = [];
    }

    // Build form from schema
    this.buildFormFromSchema();
  }

  private buildFormFromSchema(values?: Record<string, any>) {
    this.form = this.dfService.buildForm(this.schema as any);
    if (values) {
      this.form.patchValue(values);
    } else {
      // Try to load saved values if any
      try {
        const raw = sessionStorage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // patch first saved values if any
            if (parsed[0].values) this.form.patchValue(parsed[0].values);
          }
        }
      } catch {}
    }
  }

  selectSubmission(idx: number) {
    if (idx < 0 || idx >= this.submissions.length) return;
    this.selectedIndex = idx;
    const item = this.submissions[idx];
    this.schema = item.schema || [];
    this.buildFormFromSchema(item.values || {});
    this.editMode = false;
  }

  openSubmissionModal(idx: number) {
    this.selectSubmission(idx);
    this.showFormModal = true;
  }

  closeFormModal() {
    this.showFormModal = false;
  }

  

  deleteSubmission(idx: number) {
    if (idx < 0 || idx >= this.submissions.length) return;
    this.submissions.splice(idx, 1);
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.submissions));
    // adjust selection
    if (this.submissions.length === 0) {
      this.selectedIndex = null;
      this.schema = [];
      this.buildFormFromSchema();
    } else {
      const newIndex = Math.max(0, idx - 1);
      this.selectSubmission(newIndex);
    }
  }

  createNew() {
    this.selectedIndex = null;
    this.schema = [];
    this.buildFormFromSchema();
    this.editMode = true;
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  // Open a submission directly in edit mode
  editSubmission(idx: number) {
    if (idx < 0 || idx >= this.submissions.length) return;
    this.selectedIndex = idx;
    const item = this.submissions[idx];
    this.schema = item.schema || [];
    this.buildFormFromSchema(item.values || {});
    this.editMode = true;
    // open modal to edit (popup)
    this.showFormModal = true;
  }

  // Close modal and open the builder on the page so user can add more fields
  addMoreFields(idx: number | null) {
    if (idx !== null && (idx < 0 || idx >= this.submissions.length)) return;
    // ensure current submission is selected so builder pre-populates
    if (idx !== null) this.selectSubmission(idx);
    // close modal and show builder
    this.showFormModal = false;
    this.editMode = true;
    // scroll builder into view (optional UX improvement)
    setTimeout(() => {
      const el = document.querySelector('app-ui-builder');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  onFieldDropped(fieldDef: any) {
    // Convert the lightweight def into a DynamicField and add to our schema
    const newField: DynamicField = {
      type: fieldDef.type || 'textbox',
      label: fieldDef.label || (fieldDef.key || 'field'),
      controlName: fieldDef.key || `field_${Date.now()}`,
      options: fieldDef.options || undefined,
      required: Array.isArray(fieldDef.validators) ? fieldDef.validators.includes('required') : false
    };

    this.schema.push(newField);

    // Add control to form
    const validators = newField.required ? [Validators.required] : [];
    this.form.addControl(newField.controlName, new FormControl('', validators));
  }

  saveForm() {
    const values = this.form.value;
    const payload = { schema: this.schema, values, createdAt: Date.now() };
    try {
      if (this.selectedIndex !== null && this.selectedIndex >= 0 && this.selectedIndex < this.submissions.length) {
        // update existing
        this.submissions[this.selectedIndex] = { schema: this.schema, values, createdAt: payload.createdAt };
      } else {
        // new submission
        this.submissions.push(payload);
        this.selectedIndex = this.submissions.length - 1;
      }
      sessionStorage.setItem(this.storageKey, JSON.stringify(this.submissions));
      this.editMode = false;
      alert('Form saved locally');
    } catch (err) {
      console.error('Failed to save form', err);
      alert('Save failed — check console');
    }
  }
}
