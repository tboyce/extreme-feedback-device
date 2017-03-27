import { Component, Input, OnInit } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { IPagedResource } from '../models/paged-resource';
import { IStatusItem } from '../models/status-item';

@Component({
  selector: 'app-manage-status-items',
  templateUrl: './manage-status-items.component.html',
  styleUrls: ['./manage-status-items.component.css']
})
export class ManageStatusItemsComponent implements OnInit {

  @Input() resourceName: string;
  @Input() failedStatus: string;

  private baseUrl: string;
  asyncStatusItems: Observable<IStatusItem[]>;
  page = 1;
  itemsPerPage: number;
  total: number;
  loading: boolean;

  constructor(public http: Http) {
    this.baseUrl = environment.API_BASE_URL;
    this.itemsPerPage = environment.itemsPerPage;
  }

  ngOnInit() {
    this.getPage(this.page);
  }

  deleteStatusItem(id) {
    this.http.delete(this.baseUrl + '/' + this.resourceName + '/' + id)
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

    this.asyncStatusItems = this.http.get(this.baseUrl + '/' + this.resourceName, requestOptions)
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
