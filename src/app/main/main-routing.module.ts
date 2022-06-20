
import { Routes } from '@angular/router';
import { AddCatalogComponent } from './components/add-catalog/add-catalog.component';
import { AddPhotosComponent } from './components/add-photos/add-photos.component';
import { AllComponent } from './components/all/all.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PhotoComponent } from './components/photo/photo.component';
import { MainComponent } from './main.component';

 export let MainRoute: Routes = [
  {path: "", component: MainComponent, children: [
    {path: "catalog/:id", component: CatalogComponent},
    {path: "photo/:id", component: PhotoComponent},
    {path: "add-photos/:id", component: AddPhotosComponent},
    {path: "add-catalog", component: AddCatalogComponent},
    {path: "", component: AllComponent},
    {path: "**", component: NotFoundComponent}
  ]}
];
