// import { Injectable } from '@angular/core';
// import { DynamicField } from '../models/form-field.model';
// import { FormGroup, FormControl, Validators } from '@angular/forms';

// @Injectable({
//   providedIn: 'root'
// })
// export class DynamicFormService {

// buildForm(fields: DynamicField[]): FormGroup {
//     const group: any = {};

//     fields.forEach(field => {
//       group[field.label] = new FormControl(
//         field.value || '',
//         field.required ? Validators.required : []
//       );
//     });

//     return new FormGroup(group);
//   }}
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicField } from '../models/form-field.model';

@Injectable({ providedIn: 'root' })
export class DynamicFormService {

  buildForm(fields: DynamicField[]): FormGroup {
    const group: any = {};

    fields.forEach(field => {
      const validators: any[] = [];

      if (field.required) validators.push(Validators.required);
      if (field.minLength) validators.push(Validators.minLength(field.minLength));
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));

      // Built-in patterns
      if (field.validationType && field.validationType !== 'none') {
        switch (field.validationType) {
          case 'alphabets':
            validators.push(Validators.pattern(/^[A-Za-z]+$/));
            break;
          case 'numbers':
            validators.push(Validators.pattern(/^[0-9]+$/));
            break;
          case 'alphanumeric':
            validators.push(Validators.pattern(/^[A-Za-z0-9]+$/));
            break;
          case 'email':
            validators.push(Validators.email);
            break;
          case 'custom':
            if (field.customPattern) {
              try {
                const reg = new RegExp(field.customPattern);
                validators.push(Validators.pattern(reg));
              } catch (e) {
                // ignore invalid regex here; UI should prevent invalid regex
              }
            }
            break;
        }
      }

      // default empty value
      group[field.controlName || field.label] = new FormControl('', validators);
    });

    return new FormGroup(group);
  }
}

