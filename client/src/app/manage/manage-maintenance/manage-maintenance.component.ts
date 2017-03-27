import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-maintenance',
  templateUrl: './manage-maintenance.component.html',
  styleUrls: ['./manage-maintenance.component.css']
})
export class ManageMaintenanceComponent implements OnInit {

  form: FormGroup;
  maintenance = new FormControl();
  private baseUrl: string;

  constructor(public http: Http, fb: FormBuilder) {
    this.baseUrl = environment.API_BASE_URL;

    this.form = fb.group({
      'maintenance': this.maintenance
    });
  }

  ngOnInit() {
    this.http.get(this.baseUrl + '/maintenance')
      .map(res => res.json())
      .subscribe(res => {
        this.maintenance.setValue(res);

        this.maintenance.valueChanges.subscribe((val) => {
          if (val) {
            return this.http.post(this.baseUrl + '/maintenance', {})
              .subscribe();
          } else {
            return this.http.delete(this.baseUrl + '/maintenance')
              .subscribe();
          }
        });
      });
  }
}
