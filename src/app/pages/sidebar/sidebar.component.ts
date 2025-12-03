import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

 @Output() collapsedChange = new EventEmitter<boolean>();
 

  isCollapsed = false;
  constructor(private router: Router) {}

  // constructor(private router: Router, private sidebarService : SidebarService) {
  //   const savedState = localStorage.getItem('sidebar-collapsed');
  //   this.isCollapsed = savedState === 'true';
  // }

  toggleSidebar(): void {
      // this.sidebarService.toggle();
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebar-collapsed', this.isCollapsed.toString());
    this.collapsedChange.emit(this.isCollapsed);   // <-- Send event to parent
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
   logout(): void {
  // Clear all local data
  localStorage.clear();

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
}