import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStatusItemsComponent } from './manage-status-items.component';

describe('ManageStatusItemsComponent', () => {
  let component: ManageStatusItemsComponent;
  let fixture: ComponentFixture<ManageStatusItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStatusItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStatusItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
