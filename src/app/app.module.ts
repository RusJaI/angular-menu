import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScreenviewComponent } from './pages/screenview/screenview.component';
import { NgxCaptureModule } from 'ngx-capture';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ScreenviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxCaptureModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
