import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxeslistComponent } from './textboxeslist.component';

describe('TextboxeslistComponent', () => {
  let component: TextboxeslistComponent;
  let fixture: ComponentFixture<TextboxeslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextboxeslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextboxeslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
