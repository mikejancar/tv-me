import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EpisodeModule } from './episode/episode.module';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material.module';
import { SearchModule } from './search/search.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    SearchModule,
    EpisodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
