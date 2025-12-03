import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-ui',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dynamic-ui.component.html',
  styleUrl: './dynamic-ui.component.css'
})
export class DynamicUiComponent {
  role = 'admin'; 
}
