import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import { AddPrescriptionComponent } from './add-prescription.component';

describe('AddPrescriptionComponent', () => {
  let component: AddPrescriptionComponent;
  let fixture: ComponentFixture<AddPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrescriptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
