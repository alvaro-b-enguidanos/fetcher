import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class LoadingService {
  readonly isLoading = computed<boolean>(() => this.count() >= 1);

  private readonly count = signal(0);

  show() {
    this.count.update((count) => count + 1);
  }

  hide() {
    this.count.update((count) => count - 1);
  }
}
