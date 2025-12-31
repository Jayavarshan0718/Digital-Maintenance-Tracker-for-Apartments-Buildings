import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRequestComponent } from './maintenance-request';

describe('MaintenanceRequestComponent', () => {
  let component: MaintenanceRequestComponent;
  let fixture: ComponentFixture<MaintenanceRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceRequestComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
