import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseStatsNewComponent } from './analyse-stats-new.component';

describe('AnalyseStatsNewComponent', () => {
  let component: AnalyseStatsNewComponent;
  let fixture: ComponentFixture<AnalyseStatsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyseStatsNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyseStatsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
