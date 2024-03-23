import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddProtocolComponent } from './add-protocol/add-protocol.component';
import { ProtocolsComponent } from './protocols/protocols.component';
import { AddMedicineComponent } from './add-medicine/add-medicine.component';
import { ListProtocolsComponent } from './list-protocols/list-protocols.component';

@NgModule({
  declarations: [
    ProtocolsComponent,
    AddMedicineComponent,
    AddProtocolComponent,
    ListProtocolsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ProtocolsComponent,
    AddProtocolComponent,
  ]
})
export class ProtocolsModule { }
