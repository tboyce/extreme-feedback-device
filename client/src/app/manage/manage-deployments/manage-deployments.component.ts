import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-manage-deployments',
  templateUrl: './manage-deployments.component.html',
  styleUrls: ['./manage-deployments.component.css']
})
export class ManageDeploymentsComponent implements OnInit {

  private baseUrl: string;
  deployments: any[];

  constructor(public http: Http) {
    this.baseUrl = environment.API_BASE_URL;
  }

  ngOnInit() {

    this.http.get(this.baseUrl + '/deployments')
      .map(res => res.json())
      .subscribe(res => {
        this.deployments = res;
      });
  }

  deleteDeployment(index) {
    const deployment = this.deployments[index];
    this.deployments.splice(index, 1);
    this.http.delete(this.baseUrl + '/deployments/' + deployment.id)
      .subscribe();
  }

}
