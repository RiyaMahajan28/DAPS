import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/profile.component';
import { SettingsComponent } from '../settings/settings.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-container',
  standalone: true,
  imports: [CommonModule, HomeComponent,ProfileComponent,SettingsComponent],
  templateUrl: './menu-container.component.html',
  styleUrl: './menu-container.component.css'
})
export class MenuContainerComponent {
  selected='home';

  menu=[
    {label:'Home',value:'home'},
    {label:'Profile',value:'profile'},
    {label:'Settings',value:'settings'}
  ];
  changePage(page:string){
    this.selected=page;
  }
}
