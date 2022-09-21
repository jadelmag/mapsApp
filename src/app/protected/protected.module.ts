import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapsModule } from '../maps/maps.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, ProtectedRoutingModule, MapsModule],
})
export class ProtectedModule {}
