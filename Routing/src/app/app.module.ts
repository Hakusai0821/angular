import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Routing Module
import { AppRoutingModule } from './app-routing.module';

// Module // 練習延遲載入，所以要把Module拿掉
// import { FeatureModule } from './feature/feature.module';

// Component
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    // 練習延遲載入，所以要把Module拿掉
    // FeatureModule, //子路由必須放在 AppRoutingModule前面(因為程式碼順序)
    AppRoutingModule,
    FormsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
