import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css'
})
export class StateListComponent implements OnInit {

  states: any[] = [];
  filteredStates: any[] = []; // filtered list to show in table
  searchTerm: string = '';
  loading = false;
  

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadStates();
  }

  loadStates() {
    this.loading = true;
    this.api.getClientZone().subscribe({
      next: (res: any) => {
        this.states = res?.data || [];
        this.filteredStates = this.states; // Initialize filtered states
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
  editState(state: any) {
    // add-state is now nested under /state-list/add/:id
    this.router.navigate(['add-state', state.zoneId], );
  }

  addState() {
    this.router.navigate(['add-state']);
  }

  onSearch(event: any): void {
    const term = event.target.value.toLowerCase();
    
    // If search is empty, show all records
    if (!term) {
      this.filteredStates = this.states;
      return;
    }
    
    // Special handling for status searches
    if (term === 'active' || term === 'inactive' || term === 'y' || term === 'n') {
      this.filteredStates = this.states.filter(state => {
        if (term === 'active' || term === 'y') {
          return state.zonestatus === 'Y';
        } else if (term === 'inactive' || term === 'n') {
          return state.zonestatus === 'N';
        }
        return false;
      });
      return;
    }
    
    // Filter by all other columns
    this.filteredStates = this.states.filter(state => {
      const statusDisplay = state.zonestatus === 'Y' ? 'active' : 'inactive';
      
      return state.zoneName.toLowerCase().includes(term) ||
        state.zoneshortCode.toLowerCase().includes(term) ||
        state.zonestatus.toLowerCase().includes(term) ||
        statusDisplay.includes(term) ||
        state.clientName.toLowerCase().includes(term);
    });
  }

  exportToExcel(): void {
    if (this.states.length === 0) {
      return;
    }

    // Prepare data for Excel export
    const exportData = this.states.map(state => ({
      'State Name': state.zoneName,
      'Short Code': state.zoneshortCode,
      'Status': state.zonestatus === 'Y' ? 'Active' : 'Inactive',
      'Client': state.clientName
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'State Records');

    // Generate Excel file and download
    const fileName = `State_Records_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
