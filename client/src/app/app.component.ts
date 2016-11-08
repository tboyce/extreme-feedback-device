import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  status: string;

  constructor(private http: Http) {
  }

  ngOnInit(): void {
    let url = 'http://tb-authorize.cloudapp.net/api/v1/builds/status';
    Observable.interval(5000)
      .switchMap(() => this.http.get(url))
      .map(res => res.json())
      .subscribe(res => {
        this.status = res.status;
      });
  }
}

