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
import { EditableFormComponent } from './dynamicUi/editable-form/editable-form.component';
import { StateListComponent } from './pages/state-list/state-list.component';
import { AddStateComponent } from './pages/add-state/add-state.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'records', component: RecordsComponent , canActivate:[authGuard]},
  { path: 'record-form', component: RecordFormComponent,canActivate:[authGuard] }, // add new
  // { path: 'record-form/:id', component: RecordFormComponent,canActivate:[authGuard] } // edit
  {path : 'record-form' , component: RecordFormComponent, canActivate: [authGuard],},
{ path: 'locations', component: LocationComponent },
{path:'dynamic-ui',component:DynamicUiComponent},
{path:'menu',component:MenuContainerComponent},
{path:'drag-n-drop',component:UiBuilderComponent},
{path:'editable-form',component:EditableFormComponent},
{ path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
{ path: 'state-list',component:StateListComponent},
{ path: 'add-state',component:AddStateComponent}

];
