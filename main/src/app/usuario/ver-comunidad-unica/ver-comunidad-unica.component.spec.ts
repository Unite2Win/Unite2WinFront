import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerComunidadUnicaComponent } from './ver-comunidad-unica.component';

describe('VerComunidadUnicaComponent', () => {
  let component: VerComunidadUnicaComponent;
  let fixture: ComponentFixture<VerComunidadUnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerComunidadUnicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerComunidadUnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
