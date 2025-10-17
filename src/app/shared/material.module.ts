import { NgModule } from '@angular/core';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';

const MaterialModules = [
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatChipsModule,
];

@NgModule({
  imports: MaterialModules,
  exports: MaterialModules,
})
export class MaterialModule {}
