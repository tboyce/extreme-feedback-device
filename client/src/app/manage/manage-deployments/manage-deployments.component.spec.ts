import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeploymentsComponent } from './manage-deployments.component';

describe('ManageDeploymentsComponent', () => {
  let component: ManageDeploymentsComponent;
  let fixture: ComponentFixture<ManageDeploymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDeploymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDeploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
