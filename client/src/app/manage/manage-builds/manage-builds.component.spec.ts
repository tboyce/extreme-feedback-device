import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBuildsComponent } from './manage-builds.component';

describe('ManageBuildsComponent', () => {
  let component: ManageBuildsComponent;
  let fixture: ComponentFixture<ManageBuildsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBuildsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBuildsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
