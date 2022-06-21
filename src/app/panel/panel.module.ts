import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelComponent } from './panel.component';
import { RouterModule } from '@angular/router';
import { PanelRouter } from "./panel-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuPanelComponent } from './components/menu-panel/menu-panel.component';
import { ComponentsPanelComponent } from './components/components-panel/components-panel.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { CatalogPanelComponent } from './components/catalog-panel/catalog-panel.component';
import { PhotoPanelComponent } from './components/photo-panel/photo-panel.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [
    PanelComponent,
    MenuPanelComponent,
    ComponentsPanelComponent,
    MainPanelComponent,
    CatalogPanelComponent,
    PhotoPanelComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PanelRouter),
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class PanelModule { }
