import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = localStorage.getItem('accessToken')

    if(accessToken) {
     const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + accessToken)
      });
    // console.log('AuthInterceptor accessToken found: ' + JSON.stringify(accessToken))
      return next.handle(cloned);
    }else{
    //  console.log('AuthInterceptor accessToken not found')
      return next.handle(request)
    }
  }
}
