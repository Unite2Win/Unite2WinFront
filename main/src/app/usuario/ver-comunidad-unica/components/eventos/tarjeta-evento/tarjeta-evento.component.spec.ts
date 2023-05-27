import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaEventoComponent } from './tarjeta-evento.component';

describe('TarjetaEventoComponent', () => {
  let component: TarjetaEventoComponent;
  let fixture: ComponentFixture<TarjetaEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarjetaEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
