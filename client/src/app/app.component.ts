import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  baseUrl = 'http://xfd.cloudapp.net/api/v1'
  buildStatus = true;
  deploymentStatus = true;
  testStatus = true;

  constructor(private http: Http) {
  }

  ngOnInit(): void {
    Observable.interval(5000)
      .switchMap(() => this.http.get(this.baseUrl + '/builds/status'))
      .map(res => res.json())
      .subscribe(res => {
        this.buildStatus = res.buildStatus === 'success';
        this.testStatus = res.testStatus === 'success';
      });

    Observable.interval(5000)
      .switchMap(() => this.http.get(this.baseUrl + '/deployments/status'))
      .map(res => res.json())
      .subscribe(res => {
        this.deploymentStatus = res.status === 'success';
      });
  }

  get overallStatus() {
    return (this.buildStatus && this.testStatus && this.deploymentStatus);
  }
}

