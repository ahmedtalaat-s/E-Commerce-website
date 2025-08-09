import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailformPageComponent } from './emailform-page.component';

describe('EmailformPageComponent', () => {
  let component: EmailformPageComponent;
  let fixture: ComponentFixture<EmailformPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailformPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailformPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
