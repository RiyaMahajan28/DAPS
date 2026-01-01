import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RecordsComponent } from './records.component';
import { RecordFormComponent } from '../record-form/record-form.component';
import { RecordsRoutingModule } from './records-routing.module';

@NgModule({
  declarations: [RecordsComponent, RecordFormComponent],
  imports: [SharedModule, RecordsRoutingModule]
})
export class RecordsModule {}
