import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'records', loadChildren: () => import('./pages/records/records.module').then(m => m.RecordsModule) },
  { path: 'locations', loadChildren: () => import('./pages/location/location.module').then(m => m.LocationModule) },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'state-list', loadChildren: () => import('./pages/state/state.module').then(m => m.StateModule) },
  // fallback
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
