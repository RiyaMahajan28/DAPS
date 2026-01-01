import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StateListComponent } from '../state-list/state-list.component';
import { AddStateComponent } from '../add-state/add-state.component';
import { StateRoutingModule } from './state-routing.module';

@NgModule({
  declarations: [StateListComponent, AddStateComponent],
  imports: [SharedModule, StateRoutingModule]
})
export class StateModule {}
