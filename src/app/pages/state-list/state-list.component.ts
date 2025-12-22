import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-state-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css'
})
export class StateListComponent implements OnInit {

  states: any[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadStates();
  }

  loadStates() {
    this.loading = true;
    this.api.getClientZone().subscribe({
      next: (res: any) => {
        this.states = res?.data || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
