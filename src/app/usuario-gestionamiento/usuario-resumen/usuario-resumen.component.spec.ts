import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioResumenComponent } from './usuario-resumen.component';

describe('UsuarioResumenComponent', () => {
  let component: UsuarioResumenComponent;
  let fixture: ComponentFixture<UsuarioResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
