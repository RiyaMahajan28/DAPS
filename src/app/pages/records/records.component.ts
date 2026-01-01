import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

  constructor(private api: ApiService, private router: Router) {}
  // toggleSidebar() {
//   this.sidebarService.toggle();
// }
  ngOnInit(): void {
  this.api.getClients().subscribe({
    next: (data:any) => {
      this.records = data?.data;
        console.log(this.records)

    },
    error: (err) => console.error(err)
  });
}


  editRecord(client: any){
    this.api.setSelectedClient(client);
    // record-form is a child route of /records
    this.router.navigate(['/records', 'record-form'], { state: { recordId: client?.clientId } });
  }
 
  addRecord() {
    this.api.clearSelectedClient();
    this.router.navigate(['/records', 'record-form']);
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
  // onSearch() {
  //   const term = this.searchTerm.toLowerCase();

  //   // Filter by clientName or shortCode
  //   this.filteredRecords = this.records.filter(client =>
  //     client.clientName.toLowerCase().includes(term) ||
  //     client.shortCode.toLowerCase().includes(term)
  //   );
  // }
}
