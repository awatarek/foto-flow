
import { Routes } from '@angular/router';
import { CatalogPanelComponent } from './components/catalog-panel/catalog-panel.component';
import { CatalogPhotoPanelComponent } from './components/catalog-photo-panel/catalog-photo-panel.component';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { PhotoVerificationPanelComponent } from './components/photo-verification-panel/photo-verification-panel.component';
import { PanelComponent } from './panel.component';

 export let PanelRouter: Routes = [
  {path: "", component: PanelComponent, 
    children: [
      {path: "catalogs", children:[
        {path: ":id", component: CatalogPhotoPanelComponent},
        {path: "", component: CatalogPanelComponent}
      ]},
      {path: "verification", component: PhotoVerificationPanelComponent},
      {path: "", component: MainPanelComponent}
    ]
  }
];
