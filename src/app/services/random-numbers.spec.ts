import { TestBed } from '@angular/core/testing';

import { RandomNumbers } from './random-numbers';

describe('RandomNumbers', () => {
  let service: RandomNumbers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomNumbers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
