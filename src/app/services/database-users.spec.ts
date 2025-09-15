import { TestBed } from '@angular/core/testing';

import { DatabaseUsers } from './database-users';

describe('DatabaseUsers', () => {
  let service: DatabaseUsers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseUsers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
