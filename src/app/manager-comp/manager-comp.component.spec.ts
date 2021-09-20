import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerCompComponent } from './manager-comp.component';

describe('ManagerCompComponent', () => {
  let component: ManagerCompComponent;
  let fixture: ComponentFixture<ManagerCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerCompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
