import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";
import { LayoutGuard } from "./layout/layout.guard";
const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    canActivate: [LayoutGuard],
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
  },
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
