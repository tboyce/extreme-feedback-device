import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { IPagedResource } from '../models/paged-resource';
import { IStatusItem } from '../models/status-item';

@Component({
  selector: 'app-manage-deployments',
  templateUrl: './manage-deployments.component.html',
  styleUrls: ['./manage-deployments.component.css']
})
export class ManageDeploymentsComponent implements OnInit {

  private baseUrl: string;
  asyncDeployments: Observable<IStatusItem[]>;
  page = 1;
  itemsPerPage = 10;
  total: number;
  loading: boolean;

  constructor(public http: Http) {
    this.baseUrl = environment.API_BASE_URL;
  }

  ngOnInit() {
    this.getPage(this.page);
  }

  deleteDeployment(id) {
    this.http.delete(this.baseUrl + '/deployments/' + id)
      .subscribe(() => {
        this.getPage(this.page);
      });
  }

  getPage(page: number) {
    this.loading = true;

    const params: URLSearchParams = new URLSearchParams();
    params.set('page', page.toString());
    params.set('count', this.itemsPerPage.toString());

    const requestOptions = new RequestOptions();
    requestOptions.search = params;

    this.asyncDeployments = this.http.get(this.baseUrl + '/deployments', requestOptions)
      .map(res => res.json())
      .do((res: IPagedResource<IStatusItem>) => {
        this.total = res.total;
        if (page > Math.ceil(this.total / this.itemsPerPage)) {
          this.getPage(page - 1);
        } else {
          this.page = page;
        }
        this.loading = false;
      })
      .map(res => res.items);
  }

}
