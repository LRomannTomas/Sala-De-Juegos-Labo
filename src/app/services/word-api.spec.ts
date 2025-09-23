import { TestBed } from '@angular/core/testing';

import { WordApi } from './word-api';

describe('WordApi', () => {
  let service: WordApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
