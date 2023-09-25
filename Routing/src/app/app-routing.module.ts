import { NgModule } from "@angular/core";
// 預先載入 import { PreloadAllModules } from '@angular/router';
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";
import { LayoutGuard } from "./layout/layout.guard";
import { EnsureLoginGuard } from "./login/ensure-login.guard";
const routes: Routes = [
  {
    path: "", //預設路徑為  LayoutComponent
    component: LayoutComponent,
    canActivate: [LayoutGuard],  //路由守衛
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "about",
        component: AboutComponent,
      },
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "feature",
    // loadChildren --模組延遲載入功能主要就是透過這個屬性來設定。
    loadChildren: () =>
      import("./feature/feature.module").then((m) => m.FeatureModule),
  },
  {
    path: "login",
    component: LoginComponent,
    canDeactivate: [EnsureLoginGuard]
  },
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
