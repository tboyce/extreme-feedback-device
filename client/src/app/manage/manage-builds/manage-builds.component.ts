import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-manage-builds',
  templateUrl: './manage-builds.component.html',
  styleUrls: ['./manage-builds.component.css']
})
export class ManageBuildsComponent implements OnInit {

  private baseUrl: string;
  builds: any[];

  constructor(public http: Http) {
    this.baseUrl = environment.API_BASE_URL;
  }

  ngOnInit() {

    this.http.get(this.baseUrl + '/builds')
      .map(res => res.json())
      .subscribe(res => {
        this.builds = res;
      });
  }

  deleteBuild(index) {
    const build = this.builds[index];
    this.builds.splice(index, 1);
    this.http.delete(this.baseUrl + '/builds/' + build.id)
      .subscribe();
  }

}
