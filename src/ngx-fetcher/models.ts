import { Signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface FetcherConf {
  connectToLoading?: boolean;
}

export type FetcherSource<RespType> =
  | Observable<RespType>
  | (() => Observable<RespType>);

export interface FetcherAPI<RespType = any, ErrorType = any> {
  loading: Signal<boolean>;
  error: Signal<ErrorType | undefined>;
  data: Signal<RespType | undefined>;
  fetch: (source$: FetcherSource<RespType>) => void;
  replay: () => void;
  _triggered: Signal<boolean>;
}
