import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionistaBusquedaComponent } from './recepcionista-busqueda.component';

describe('RecepcionistaBusquedaComponent', () => {
  let component: RecepcionistaBusquedaComponent;
  let fixture: ComponentFixture<RecepcionistaBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionistaBusquedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionistaBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
