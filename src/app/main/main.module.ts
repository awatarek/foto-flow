import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { MainRoute } from './main-routing.module';
import { AllComponent } from './components/all/all.component';
import { CatalogComponent, ImageDialog } from './components/catalog/catalog.component';
import { PhotoComponent } from './components/photo/photo.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatChipsModule } from "@angular/material/chips";
import {MatIconModule} from '@angular/material/icon';
import { AddPhotosComponent } from './components/add-photos/add-photos.component';
import { AddCatalogComponent } from './components/add-catalog/add-catalog.component';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [
    MainComponent,
    AllComponent,
    CatalogComponent,
    PhotoComponent,
    NotFoundComponent,
    ImageDialog,
    AddPhotosComponent,
    AddCatalogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MainRoute),
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    FileUploadModule,
    InputTextModule,
    ButtonModule
  ]
})
export class MainModule { }
