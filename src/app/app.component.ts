import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./pages/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { RecordsComponent } from './pages/records/records.component';
// import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

 title = 'DAPS_Project';
  isSidebarCollapsed = false;

  get isLoginPage(): boolean {
    return location.pathname === '/login';
  }

  onSidebarToggle(value: boolean) {
    this.isSidebarCollapsed = value;
  }
}