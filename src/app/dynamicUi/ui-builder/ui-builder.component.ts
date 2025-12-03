import { Component } from '@angular/core';
import { DynamicFormService } from '../../services/dynamic-form.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicField } from '../../models/form-field.model';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-builder',
  standalone: true,
  imports: [DragDropModule,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './ui-builder.component.html',
  styleUrl: './ui-builder.component.css'
})

export class UiBuilderComponent {

  // Palette items (templates)
  components: DynamicField[];

  // Fields the user has dropped and configured
  formFields: DynamicField[] = [];

  // Generated reactive form (built when user clicks Generate Form)
  dynamicForm!: FormGroup | null;

  // Config modal (shown after dropping a palette item)
  showConfigModal = false;
  configField!: DynamicField | null; // working copy while user configures

  // Generated form modal (shown after clicking Generate Form)
  showGeneratedModal = false;

  constructor(private dfService: DynamicFormService) {
    // Move components initialization to the constructor to ensure formFields is defined
    this.formFields = []; // Ensure formFields is initialized
    this.components = [
      { type: 'textbox', label: 'Textbox', required: true, controlName: this.generateControlName('Textbox') },
      { type: 'dropdown', label: 'Dropdown', options: ['A', 'B', 'C'], required: true, controlName: this.generateControlName('Dropdown') },
      { type: 'radio', label: 'Radio', options: ['Yes', 'No'], required: true, controlName: this.generateControlName('Radio') },
      { type: 'textarea', label: 'Textarea', required: true, minLength: 10, maxLength: 100, controlName: this.generateControlName('Textarea') },
      { type: 'image', label: 'Image Upload', required: true, controlName: this.generateControlName('Image Upload') }
    ];
  }

  // helper: generate camelCase safe control name from label
  private generateControlName(label: string): string {
    // remove non-alphanumeric, split words and camelCase
    const words = label
      .replace(/[^a-zA-Z0-9 ]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map(w => w.toLowerCase());
    if (!words.length) return `field_${Date.now()}`;
    const [first, ...rest] = words;
    const camel = first + rest.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    // ensure uniqueness by appending index if duplicate exists
    let name = camel;
    let i = 1;
    while (this.formFields.some(f => f.controlName === name)) {
      name = `${camel}${i++}`;
    }
    return name;
  }

  // When user drags from palette -> open config modal (do NOT directly add)
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer !== event.container) {
      const paletteItem = { ...event.previousContainer.data[event.previousIndex] } as DynamicField;
      // create a fresh config object with defaults
      const config: DynamicField = {
        type: paletteItem.type,
        label: '',
        options: paletteItem.options ? [...paletteItem.options] : undefined,
        required: !!paletteItem.required,
        minLength: paletteItem.minLength ?? null,
        maxLength: paletteItem.maxLength ?? null,
        validationType: 'none',
        customPattern: null,
        controlName: this.generateControlName(paletteItem.label || 'Field')
      };
      this.configField = config;
      this.showConfigModal = true;
    }
    // this.generateForm();
  }

  // Called when user saves configuration in modal
  saveConfig() {
    if (!this.configField) return;

    // label validation
    const label = (this.configField.label || '').trim();
    if (!label) {
      alert('Label is required');
      return;
    }

    // Ensure controlName is always set and unique
    if (!this.configField.controlName) {
      this.configField.controlName = this.generateControlName(label);
    }

    const savedField: DynamicField = {
      ...this.configField,
      label,
    };

    this.formFields.push(savedField);

    // close config modal
    this.configField = null;
    this.showConfigModal = false;
  }

  cancelConfig() {
    this.configField = null;
    this.showConfigModal = false;
  }

  // Build the reactive form using the service and open generated modal
  generateForm() {
    this.dynamicForm = this.dfService.buildForm(this.formFields);
    this.showGeneratedModal = true;
  }

  closeGeneratedModal() {
    this.showGeneratedModal = false;
    // keep dynamicForm around if you want to reuse; or set to null if you prefer
    // this.dynamicForm = null;
  }

  // Submit handler for generated form
  submitForm() {
    if (!this.dynamicForm) return;
    if (this.dynamicForm.valid) {
      console.log('Form Output:', this.dynamicForm.value);
      alert('Form submitted successfully (check console).');
      this.closeGeneratedModal();
    } else {
      // show errors
      this.dynamicForm.markAllAsTouched();
      // focus first invalid control (optional)
      const firstInvalid = Object.keys(this.dynamicForm.controls).find(k => this.dynamicForm!.get(k)?.invalid);
      if (firstInvalid) {
        const el = document.querySelector(`[formcontrolname="${firstInvalid}"]`) as HTMLElement | null;
        el?.focus?.();
      }
    }
  }

  // file input handling safely typed
  onFileSelect(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.dynamicForm?.get(controlName)?.setValue(file);
  }

  // Allow removing a field from canvas
  removeField(idx: number) {
    this.formFields.splice(idx, 1);
  }
}


