import { Component } from '@angular/core';
import { PrescriptionModule } from './prescriptions/prescriptions.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ PrescriptionModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyProtocols-UI';
}
