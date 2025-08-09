import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpassPageComponent } from './resetpass-page.component';

describe('ResetpassPageComponent', () => {
  let component: ResetpassPageComponent;
  let fixture: ComponentFixture<ResetpassPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetpassPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetpassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
