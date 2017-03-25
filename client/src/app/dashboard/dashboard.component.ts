import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  baseUrl = environment.API_BASE_URL;
  buildSuccess = true;
  deploymentSuccess = true;
  testSuccess = true;
  maintenance = false;

  constructor(private http: Http) {
  }

  ngOnInit(): void {
    Observable.interval(5000)
      .switchMap(() => this.http.get(this.baseUrl + '/status'))
      .map(res => res.json())
      .subscribe(res => {
        this.buildSuccess = res.build === 'success';
        this.testSuccess = res.test === 'success';
        this.deploymentSuccess = res.deployment === 'success';
        this.maintenance = res.maintenance;
      });
  }

  get overallSuccess() {
    return (this.buildSuccess && this.testSuccess && this.deploymentSuccess && !this.maintenance);
  }

}
