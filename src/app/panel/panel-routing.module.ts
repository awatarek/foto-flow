
import { Routes } from '@angular/router';
import { CatalogPanelComponent } from './components/catalog-panel/catalog-panel.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { PhotoPanelComponent } from './components/photo-panel/photo-panel.component';
import { PanelComponent } from './panel.component';

 export let PanelRouter: Routes = [
  {path: "", component: PanelComponent, 
    children: [
      {path: "catalog", component: CatalogPanelComponent},
      {path: "photo", component: PhotoPanelComponent},
      {path: "", component: MainPanelComponent}
    ]
  }
];
