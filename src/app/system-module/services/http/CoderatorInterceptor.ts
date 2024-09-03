import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {map, tap} from 'rxjs/operators';



@Injectable()
export class CoderatorInterceptor implements HttpInterceptor {
        
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

            var header:any = {"Access-Control-Allow-Origin":"*"};
            var token:any  = localStorage.getItem("token");

            

            if(token!=null){
            token = JSON.parse(token);

            if(token['is_force_change_password']==true)
            window.location.href = '/#/auth'


            header["Authorization"] = "Bareer " +token['token'];

        }


            

        const rs = req.clone({setHeaders:header});


          if(token==null && window.location.href.indexOf('auth') < 0){
                window.location.href = '/#/auth'
            }

            
            return next.handle(rs).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {

                        if(event.status==401)
                        window.location.href = '/#/auth'

                }
                return event;
            },(error:any)=>{
                if(error['status']==401){
                    localStorage.removeItem('token');
                window.location.href = '/#/auth'
            }

            }));

    }

}