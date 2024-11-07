import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionistaEdicionComponent } from './recepcionista-edicion.component';

describe('RecepcionistaEdicionComponent', () => {
  let component: RecepcionistaEdicionComponent;
  let fixture: ComponentFixture<RecepcionistaEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionistaEdicionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionistaEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
