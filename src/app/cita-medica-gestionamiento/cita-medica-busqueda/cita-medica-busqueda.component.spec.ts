import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaMedicaBusquedaComponent } from './cita-medica-busqueda.component';

describe('CitaMedicaBusquedaComponent', () => {
  let component: CitaMedicaBusquedaComponent;
  let fixture: ComponentFixture<CitaMedicaBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaMedicaBusquedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaMedicaBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
