import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGPTComponent } from './chatgpt.component';

describe('CustomerSupportComponent', () => {
  let component: ChatGPTComponent;
  let fixture: ComponentFixture<ChatGPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGPTComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatGPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
