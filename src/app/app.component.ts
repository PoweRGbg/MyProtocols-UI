import { Component } from '@angular/core';
import {  HttpClientModule } from '@angular/common/http';
import { PrescriptionModule } from './prescriptions/prescriptions.module';
import { PrescriptionService } from './prescriptions/prescriptions-service/prescriptions.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ PrescriptionModule, HttpClientModule ],
  providers: [ PrescriptionService ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyProtocols-UI';
}
