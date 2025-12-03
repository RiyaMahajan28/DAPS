export interface DynamicField {
  type: 'textbox' | 'dropdown' | 'radio' | 'textarea' | 'image';
  label: string;                 // user visible label
  controlName: string;          // auto-generated safe name used as formControlName
  options?: string[];            // for dropdown / radio
  required?: boolean;
  minLength?: number | null;     // for textbox/textarea
  maxLength?: number | null;
  validationType?: 'none' | 'alphabets' | 'numbers' | 'alphanumeric' | 'email' | 'custom';
  customPattern?: string | null; // pattern string when validationType === 'custom'
}

