import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RecordFormComponent } from './pages/record-form/record-form.component';
import { RecordsComponent } from './pages/records/records.component';
import { authGuard } from './auth.guard';
import { Component } from '@angular/core';
import { LocationComponent } from './pages/location/location.component';
import { DynamicUiComponent } from './dynamicUi/dynamic-ui/dynamic-ui.component';
import { MenuContainerComponent } from './dynamicUi/menu-container/menu-container.component';
import { UiBuilderComponent } from './dynamicUi/ui-builder/ui-builder.component';

// export const routes: Routes = [
//     {path:'',component:LoginComponent},
//     {path:'login', component:LoginComponent},
//     {path:'records', component:RecordsComponent},
//     {path: 'record-form',component:RecordFormComponent},
//     { path: 'record-form/:id', component: RecordFormComponent } // for edit

// ];
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'records', component: RecordsComponent , canActivate:[authGuard]},
  { path: 'record-form', component: RecordFormComponent,canActivate:[authGuard] }, // add new
  // { path: 'record-form/:id', component: RecordFormComponent,canActivate:[authGuard] } // edit
  {path : 'record-form' , component: RecordFormComponent, canActivate: [authGuard],},
{ path: 'locations', component: LocationComponent },
{path:'dynamic-ui',component:DynamicUiComponent},
{path:'menu',component:MenuContainerComponent},
{path:'',component:UiBuilderComponent}

];
