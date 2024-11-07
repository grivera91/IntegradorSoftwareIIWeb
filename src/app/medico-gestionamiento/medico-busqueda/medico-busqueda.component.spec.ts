import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoBusquedaComponent } from './medico-busqueda.component';

describe('MedicoBusquedaComponent', () => {
  let component: MedicoBusquedaComponent;
  let fixture: ComponentFixture<MedicoBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoBusquedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
