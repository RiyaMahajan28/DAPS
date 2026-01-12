import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
// Import all main feature components here
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LocationComponent } from '../pages/location/location.component';
import { RecordsComponent } from '../pages/records/records.component';
import { AddStateComponent } from '../pages/add-state/add-state.component';
import { MenuContainerComponent } from '../dynamicUi/menu-container/menu-container.component';
import { EditableFormComponent } from '../dynamicUi/editable-form/editable-form.component';
import { MainFormComponent } from '../dynamicUi/main-form/main-form.component';
import { ProfileComponent } from '../dynamicUi/profile/profile.component';
import { SettingsComponent } from '../dynamicUi/settings/settings.component';
import { UiBuilderComponent } from '../dynamicUi/ui-builder/ui-builder.component';
import { DynamicUiComponent } from '../dynamicUi/dynamic-ui/dynamic-ui.component';
import { HomeComponent } from '../dynamicUi/home/home.component';
import { StateListComponent } from '../pages/state-list/state-list.component';
import { RecordFormComponent } from '../pages/record-form/record-form.component';
import { authGuard } from '../auth.guard';
import { permissionGuard } from '../permission.guard';
import { SidebarComponent } from '../pages/sidebar/sidebar.component';
import { UserUploadComponent } from '../pages/sidebar/user-upload.component';

@NgModule({
    declarations: [
        DashboardComponent,
        LocationComponent,
        StateListComponent,
        RecordsComponent,
        RecordFormComponent,
        AddStateComponent,
        MenuContainerComponent,
        EditableFormComponent,
        MainFormComponent,
        ProfileComponent,
        SettingsComponent,
        UiBuilderComponent,
        DynamicUiComponent,
        HomeComponent,
        UserUploadComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DragDropModule,
        RouterModule.forChild([
            {
                path: '',
                canActivateChild: [authGuard], canActivate: [permissionGuard], 
                children: [
                    { path: 'dashboard', component: DashboardComponent},
                    { path: 'location', component: LocationComponent},
                    { path: 'record-form', component: RecordFormComponent},
                    { path: 'records', component: RecordsComponent },
                    { path: 'add-state', component: AddStateComponent },
                    { path: 'add-state/:id', component: AddStateComponent},
                    { path: 'state-list', component: StateListComponent },
                    { path: 'add-user', component: UserUploadComponent },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
                ]
            }
        ])
    ]
})
export class MainModule { }
