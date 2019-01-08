import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutService {
  public preloaderStateSource = new Subject<string>();

  preloaderState$ = this.preloaderStateSource.asObservable();

  updatePreloaderState(state: string) {
    this.preloaderStateSource.next(state);
  }


  public searchOverlaySource = new Subject<string>();

  searchOverlayState$ = this.searchOverlaySource.asObservable();

  updateSearchOverlayState(state: string) {
    this.searchOverlaySource.next(state);
  }


  public echartsSource = new Subject<boolean>();
  echartsState$ = this.echartsSource.asObservable();
  updateEChartsState(state: boolean) {
    this.echartsSource.next(state);
  }
}
