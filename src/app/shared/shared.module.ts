import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [],
  imports: [CommonModule, NgSelectModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgSelectModule]
})
export class SharedModule {}
