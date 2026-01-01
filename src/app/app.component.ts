import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./pages/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RecordsComponent } from './pages/records/records.component';
import { HeaderComponent } from "./pages/header/header.component";
// import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// export class AppComponent {

//  title = 'DAPS_Project';
//   isSidebarCollapsed = false;

//   get isLoginPage(): boolean {
//     return location.pathname === '/login';
//   }

//   onSidebarToggle(value: boolean) {
//     this.isSidebarCollapsed = value;
//   }
// }
export class AppComponent {

  isSidebarCollapsed = false;
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.urlAfterRedirects === '/login';
      }
    });
  }

  onSidebarToggle(value: boolean) {
    this.isSidebarCollapsed = value;
  }
}