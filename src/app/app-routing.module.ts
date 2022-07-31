import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardsGuard } from './auth/guards.guard';
import { PnfComponent } from './auth/pnf/pnf.component';
import { AddComponent } from './pages/landing/add/add.component';
import { DetailComponent } from './pages/landing/detail/detail.component';
import { EditComponent } from './pages/landing/edit/edit.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ListComponent } from './pages/landing/list/list.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'landing', component: LandingComponent, 
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', canActivate:[GuardsGuard], component:ListComponent},
      {path: 'detail/:usr', component: DetailComponent},
      {path: 'add', component: AddComponent},
      {path: 'edit/:usr', component: EditComponent}
    ]
  },
  {path: '**', component:PnfComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
