import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'ngx-loading',
  standalone: true,
  providers: [],
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="service.isLoading()">
      <ng-content></ng-content>
    </ng-container>
  `,
})
export class LoadingCmp {
  protected readonly service = inject(LoadingService);
}
