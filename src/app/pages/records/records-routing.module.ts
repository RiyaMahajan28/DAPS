import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsComponent } from './records.component';
import { RecordFormComponent } from '../record-form/record-form.component';
import { AuthGuard } from '../../core/auth.guard';

const routes: Routes = [
  { path: '', component: RecordsComponent, canActivate: [AuthGuard] },
  { path: 'record-form', component: RecordFormComponent, canActivate: [AuthGuard] },
  { path: 'record-form/:id', component: RecordFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordsRoutingModule {}
