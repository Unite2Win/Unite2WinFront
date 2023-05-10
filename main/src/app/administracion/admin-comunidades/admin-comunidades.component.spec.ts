import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComunidadesComponent } from './admin-comunidades.component';

describe('AdminComunidadesComponent', () => {
  let component: AdminComunidadesComponent;
  let fixture: ComponentFixture<AdminComunidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminComunidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
