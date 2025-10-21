import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierSeanceComponent } from './modifier-seance.component';

describe('ModifierSeanceComponent', () => {
  let component: ModifierSeanceComponent;
  let fixture: ComponentFixture<ModifierSeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierSeanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
