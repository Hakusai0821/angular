import { Injectable, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ParamMap,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LayoutGuard implements CanActivate {
  constructor(private route: ActivatedRoute, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const canActivate = route.queryParams["name"];

    // if (canActivate==='Leo') {
      
    if (
      this.route.queryParams.subscribe((queryParams) => {
        var a = queryParams['name']==='Leo';
        console.log(queryParams["name"]);
      })
    ) {
      console.log("我進來瞜");
      return true;
    } else {
      alert("你不是Leo，不能進去！");
      return false;
    }
  }
}
