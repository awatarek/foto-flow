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
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CatalogPhotoPanelComponent } from './components/catalog-photo-panel/catalog-photo-panel.component';
import { PhotoVerificationPanelComponent } from './components/photo-verification-panel/photo-verification-panel.component';
import { MatSortModule } from '@angular/material/sort';
import {TableModule} from 'primeng/table';
import {ImageModule} from 'primeng/image';
import {ButtonModule} from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {TreeSelectModule} from 'primeng/treeselect';

@NgModule({
  declarations: [
    PanelComponent,
    MenuPanelComponent,
    ComponentsPanelComponent,
    MainPanelComponent,
    CatalogPanelComponent,
    CatalogPhotoPanelComponent,
    PhotoVerificationPanelComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(PanelRouter),
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    TableModule,
    ImageModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    SidebarModule,
    MultiSelectModule,
    InputTextModule,
    CheckboxModule,
    TreeSelectModule,
  ]
})
export class PanelModule { }
