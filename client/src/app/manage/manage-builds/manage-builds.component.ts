import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { IPagedResource } from '../models/paged-resource';
import { IStatusItem } from '../models/status-item';

@Component({
  selector: 'app-manage-builds',
  templateUrl: './manage-builds.component.html',
  styleUrls: ['./manage-builds.component.css']
})
export class ManageBuildsComponent implements OnInit {

  private baseUrl: string;
  asyncBuilds: Observable<IStatusItem[]>;
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

  deleteBuild(id) {
    this.http.delete(this.baseUrl + '/builds/' + id)
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

    this.asyncBuilds = this.http.get(this.baseUrl + '/builds', requestOptions)
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
