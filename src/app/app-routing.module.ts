import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: "login", loadChildren: () => import('./login').then(m => m.LoginModule)},
  {path: "panel", loadChildren: () => import('./panel').then(m => m.PanelModule)},
  {path: "", loadChildren: () => import("./main").then(m => m.MainModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
