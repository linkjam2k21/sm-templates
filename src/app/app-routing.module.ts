import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { PlanningComponent } from './pages/planning/planning.component';
import { ReviewComponent } from './pages/review/review.component';
import { RetroComponent } from './pages/retro/retro.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: PrincipalComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'planning', component: PlanningComponent },
      { path: 'review', component: ReviewComponent },
      { path: 'retro', component: RetroComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
