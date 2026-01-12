import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
// import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrl: './records.component.css'
})
export class RecordsComponent implements OnInit{
  records: any[] = [];
  filteredRecords: any[] = []; // filtered list to show in table
  searchTerm: string = '';

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}
  // toggleSidebar() {
//   this.sidebarService.toggle();
// }
  ngOnInit(): void {
  this.api.getClients().subscribe({
    next: (data:any) => {
      this.records = data?.data;
      this.filteredRecords = this.records; // Initialize filtered records
        console.log(this.records)

    },
    error: (err) => console.error(err)
  });
}


  editRecord(client: any){
    this.api.setSelectedClient(client);
    // record-form is a child route of /records
  this.router.navigate(['record-form'], { state: { recordId: client?.clientId } });
  }
 
  addRecord() {
    this.api.clearSelectedClient();
  this.router.navigate(['record-form']);
  }
  logout(): void {
  // Clear all local data
  sessionStorage.clear();

  // Prevent browser back navigation
  history.pushState(null,'',window.location.href);
  window.onpopstate = function(){
    history.go(1);
  }

  // Navigate back to login page (adjust route if different)
  this.router.navigate(['/login']).then(()=>{
    window.location.reload()
  });

  console.log('User logged out successfully');
}

  onSearch(event: any): void {
    const term = event.target.value.toLowerCase();
    
    // Filter by  all columns
    this.filteredRecords = this.records.filter(client =>
      client.clientName.toLowerCase().includes(term) ||
      client.shortCode.toLowerCase().includes(term)||
      client.status.toLowerCase().includes(term) ||
  client.created_by?.toLowerCase().includes(term) ||
  client.companyId.toString().includes(term) ||
  client.empannelment.toLowerCase().includes(term) ||
  client.created_on.toLowerCase().includes(term) ||
  client.clientId.toString().includes(term) 
    );
  }

  exportToExcel(): void {
    if (this.records.length === 0) {
      return;
    }

    // Prepare data for Excel export
    const exportData = this.records.map(record => ({
      'ID': record.clientId,
      'Client Name': record.clientName,
      'Short Code': record.shortCode,
      'Empannelment': record.empannelment,
      'Status': record.status === 'Y' ? 'Active' : 'Inactive',
      'Created On': record.created_on,
      'Created By': record.created_by || '-',
      'Company ID': record.companyId
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Client Records');

    // Generate Excel file and download
    const fileName = `Client_Records_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
