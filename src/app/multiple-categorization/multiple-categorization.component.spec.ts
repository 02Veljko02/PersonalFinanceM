import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleCategorizationComponent } from './multiple-categorization.component';

describe('MultipleCategorizationComponent', () => {
  let component: MultipleCategorizationComponent;
  let fixture: ComponentFixture<MultipleCategorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleCategorizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleCategorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
