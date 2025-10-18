import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeancesDashboardComponent } from './dashboardSeances.component';

describe('SeancesDashboardComponent', () => {
  let component: SeancesDashboardComponent;
  let fixture: ComponentFixture<SeancesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeancesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeancesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
