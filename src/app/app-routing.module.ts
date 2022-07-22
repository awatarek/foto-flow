import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {path: "login", loadChildren: () => import('./login').then(m => m.LoginModule)},
  {path: "panel", canActivate: [MsalGuard], loadChildren: () => import('./panel').then(m => m.PanelModule)},
  {path: "", loadChildren: () => import("./main").then(m => m.MainModule)},
];

const isIframe = window !== window.parent && !window.opener;
const initial = !isIframe ? 'enabledNonBlocking' : 'disabled';

@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: initial})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
