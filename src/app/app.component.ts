import { Component } from '@angular/core';
import {  HttpClientModule } from '@angular/common/http';
import { PrescriptionModule } from './prescriptions/prescriptions.module';
import { ProtocolsModule } from './protocols/protocols.module';
import { PrescriptionService } from './prescriptions/prescriptions-service/prescriptions.service';
import { ProtocolsService } from './protocols/protocols.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ PrescriptionModule, HttpClientModule, ProtocolsModule ],
  providers: [ PrescriptionService, ProtocolsService ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyProtocols-UI';
}
