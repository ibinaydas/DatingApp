import { Injectable, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public reqCount = 0;
  private spinnerService = inject(NgxSpinnerService);

  public show() {
    this.reqCount++;
    this.spinnerService.show(undefined, {
      type: 'ball-pulse',
      bdColor: 'rgba(255, 255, 255, 0)',
      color: 'darkgrey'
    })
  }

  public hide() {
    this.reqCount--;
    if (this.reqCount <= 0) {
      this.reqCount = 0;
      this.spinnerService.hide();
    }
  }
}
