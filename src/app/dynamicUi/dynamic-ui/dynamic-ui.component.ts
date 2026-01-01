import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-ui',
  templateUrl: './dynamic-ui.component.html',
  styleUrl: './dynamic-ui.component.css'
})
export class DynamicUiComponent {
  role = 'admin'; 
}
