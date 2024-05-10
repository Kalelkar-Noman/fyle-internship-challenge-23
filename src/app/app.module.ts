import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, CardComponent, SkeletonLoaderComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
