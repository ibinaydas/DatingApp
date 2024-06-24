import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastrService = inject(ToastrService);

  return next(req).pipe(catchError(e => {
    if (e) {
      switch (e.status) {
        case 400:
          if (e.error.errors) {
            const errorMsgs = [];
            const errors = e.error.errors;
            for (const key in errors) {
              if (errors[key]) {
                errorMsgs.push(errors[key]);
              }
            }
            throw errorMsgs.flat();
          } else {
            toastrService.error(e.error, e.status);
          }
          break;
        case 401:
          toastrService.error('Unauthorized', e.status);
          break;
        case 404:
          router.navigateByUrl('/not-found');
          break;
        case 500:
          const navExtras: NavigationExtras = { state: { error: e.error } };
          router.navigateByUrl('/server-error', navExtras);
          break;
        default:
          toastrService.error('Unexpected Error');
      }
    }
    throw e;
  }));
};
