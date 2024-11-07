import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoRegistroComponent } from './medico-registro.component';

describe('MedicoRegistroComponent', () => {
  let component: MedicoRegistroComponent;
  let fixture: ComponentFixture<MedicoRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicoRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
