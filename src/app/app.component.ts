import { Component } from '@angular/core';
import * from './prescriptions/prescriptions.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MyProtocols-UI';
}
