import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMedicaRegistroComponent } from './cita-medica-registro.component';

describe('CitaMedicaRegistroComponent', () => {
  let component: CitaMedicaRegistroComponent;
  let fixture: ComponentFixture<CitaMedicaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaMedicaRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaMedicaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
