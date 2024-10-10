import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteResumenComponent } from './paciente-resumen.component';

describe('PacienteResumenComponent', () => {
  let component: PacienteResumenComponent;
  let fixture: ComponentFixture<PacienteResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
