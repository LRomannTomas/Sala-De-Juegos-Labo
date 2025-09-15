import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoMental } from './calculo-mental';

describe('CalculoMental', () => {
  let component: CalculoMental;
  let fixture: ComponentFixture<CalculoMental>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculoMental]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculoMental);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
