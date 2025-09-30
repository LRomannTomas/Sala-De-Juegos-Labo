import { TestBed } from '@angular/core/testing';

import { PreguntadosApiService } from './preguntados-api.service';

describe('PreguntadosApiService', () => {
  let service: PreguntadosApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntadosApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
