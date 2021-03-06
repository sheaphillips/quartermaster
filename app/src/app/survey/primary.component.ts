import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GeneralDataService} from '../general-data.service';
import {HttpClient} from '@angular/common/http';

declare var window: any;

@Component({
  selector: 'survey-primary',
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.scss']
})
export class SurveyPrimaryComponent implements OnInit {

  public cacheName: string;
  public showSidebar = false;
  public surveyPath: string;
  public surveyJson: any;
  public complete: Function;
  protected initialMode = '';
  public env: 'local' | 'prod';

  // survey outcomes
  public resultKnown = false;
  public alreadyListed = false;
  public communityEndorsed = false;
  public exceededExpenseLimit = false;
  public unknownCompliance = false;
  public notCommunityEndorsed = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: GeneralDataService,
    private http: HttpClient
  ) {
  }

  ngOnInit() {

    const routeData = this.route.snapshot.data;
    this.surveyPath = routeData.survey_path;
    this.surveyJson = routeData.survey;
    this.cacheName = routeData.cache_name;
    if ('show_sidebar' in routeData) {
      this.showSidebar = routeData.show_sidebar;
    }
    this.complete = (data) => this.onComplete(data);
    const hash = this.route.snapshot.fragment;
    if (hash === 'print') {
      this.initialMode = 'print';
    }
  }

  onComplete(data) {
    if (this.cacheName) {
      if (data) {
        this.determineResult(data);
      }
    }
  }

  determineResult(data) {
    console.log('resultJson is: ' + data);

    this.alreadyListed = data.isListed === 'y';
    this.unknownCompliance = data.isCompliant === 'n';
    this.communityEndorsed = data.isCommunityEndorsed === 'y';
    this.notCommunityEndorsed = data.isCommunityEndorsed === 'n';
    this.exceededExpenseLimit = data.lessThanExpenseLimit === 'n'

    this.resultKnown = true;

  }
}
