import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisesListado } from './paises-listado';

describe('PaisesListado', () => {
  let component: PaisesListado;
  let fixture: ComponentFixture<PaisesListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisesListado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaisesListado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
