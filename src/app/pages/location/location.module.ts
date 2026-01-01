import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LocationComponent } from './location.component';
import { LocationRoutingModule } from './location-routing.module';

@NgModule({
  declarations: [LocationComponent],
  imports: [SharedModule, LocationRoutingModule]
})
export class LocationModule {}
