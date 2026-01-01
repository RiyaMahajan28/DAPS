import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateListComponent } from '../state-list/state-list.component';
import { AddStateComponent } from '../add-state/add-state.component';
import { AuthGuard } from '../../core/auth.guard';

const routes: Routes = [
  { path: '', component: StateListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddStateComponent, canActivate: [AuthGuard] },
  { path: 'add/:id', component: AddStateComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateRoutingModule {}
