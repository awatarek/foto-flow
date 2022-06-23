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

@NgModule({
  declarations: [
    MainComponent,
    AllComponent,
    CatalogComponent,
    NotFoundComponent,
    AddPhotosComponent,
    AddCatalogComponent
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
    DialogModule
  ]
})
export class MainModule { }
