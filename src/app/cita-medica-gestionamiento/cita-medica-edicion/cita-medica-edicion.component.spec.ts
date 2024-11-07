import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMedicaEdicionComponent } from './cita-medica-edicion.component';

describe('CitaMedicaEdicionComponent', () => {
  let component: CitaMedicaEdicionComponent;
  let fixture: ComponentFixture<CitaMedicaEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaMedicaEdicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaMedicaEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
