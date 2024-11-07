import { TestBed } from '@angular/core/testing';

import { MedicoService } from './medico.service';

describe('PacienteService', () => {
  let service: MedicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
