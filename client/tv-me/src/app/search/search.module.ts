import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchFormComponent, SearchComponent, SearchResultComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  exports: [SearchComponent]
})
export class SearchModule { }
