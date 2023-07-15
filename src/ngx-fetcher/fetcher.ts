import { DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from './loading.service';
import { FetcherAPI, FetcherConf, FetcherSource } from './models';

const connectLoadingToFetcher = (fetcher: FetcherAPI) => {
  const service = inject(LoadingService);
  effect(
    () => {
      if (fetcher.loading()) {
        service.show();
      } else if (fetcher._triggered()) {
        service.hide();
      }
    },
    {
      allowSignalWrites: true,
    }
  );
};

export const fetcher = <RespType = any, ErrorType = any>(
  conf?: FetcherConf
): FetcherAPI<RespType, ErrorType> => {
  const { connectToLoading = false } = conf ?? {};

  const destroyCtx = inject(DestroyRef);

  const loading = signal(false);
  const triggered = signal(false);
  const data = signal<RespType | undefined>(undefined);
  const error = signal<ErrorType | undefined>(undefined);

  let source$: FetcherSource<RespType>;

  const getEffectiveSource$ = (): Observable<RespType> =>
    typeof source$ === 'function' ? source$() : source$;

  const doFetch = () => {
    if (!source$) {
      console.error(`Not source provided!!`);
      return;
    }

    triggered.set(true);
    loading.set(true);

    getEffectiveSource$()
      .pipe(
        takeUntilDestroyed(destroyCtx),
        finalize(() => loading.set(false))
      )
      .subscribe({
        next(res) {
          data.set(res);
          if (error() !== undefined) {
            error.set(undefined);
          }
        },
        error(err) {
          error.set(err);
          if (data() !== undefined) {
            data.set(undefined);
          }
        },
      });
  };

  const fetch = (o$: FetcherSource<RespType>) => {
    source$ = o$;
    doFetch();
  };

  const replay = () => {
    doFetch();
  };

  const api = {
    loading: loading.asReadonly(),
    data: data.asReadonly(),
    error: error.asReadonly(),
    fetch,
    replay,
    _triggered: triggered.asReadonly(),
  };

  if (connectToLoading) {
    connectLoadingToFetcher(api);
  }

  return api;
};
