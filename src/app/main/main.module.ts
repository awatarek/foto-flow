import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { MainRoute } from './main-routing.module';
import { AllComponent } from './components/all/all.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MatChipsModule } from "@angular/material/chips";
import {MatIconModule} from '@angular/material/icon';
import { AddPhotosComponent } from './components/add-photos/add-photos.component';
import { AddCatalogComponent } from './components/add-catalog/add-catalog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import { PhotoSearchComponent } from './components/photo-search/photo-search.component';
import {SidebarModule} from 'primeng/sidebar';
import {TreeSelectModule} from 'primeng/treeselect';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {AccordionModule} from 'primeng/accordion';

@NgModule({
  declarations: [
    MainComponent,
    AllComponent,
    CatalogComponent,
    NotFoundComponent,
    AddPhotosComponent,
    AddCatalogComponent,
    PhotoSearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MainRoute),
    MatIconModule,
    MatChipsModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    FileUploadModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    TreeSelectModule,
    SidebarModule,
    OverlayPanelModule,
    AccordionModule,
  ]
})
export class MainModule { }
