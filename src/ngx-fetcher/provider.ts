import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { LoadingService } from './loading.service';

export const provideFetcher = (): EnvironmentProviders =>
  makeEnvironmentProviders([LoadingService]);
