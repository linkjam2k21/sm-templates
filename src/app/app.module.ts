import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './pages/principal/principal.component';
import { LoginComponent } from './pages/login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { ReviewComponent } from './pages/review/review.component';
import { ReviewComponent as ActivosComercialReviewComponent } from './pages/review/activos-comercial/review.component';
import { ReviewComponent as ActivosJuridicoCoreReviewComponent } from './pages/review/activos-juridico-core/review.component';
import { ReviewComponent as TarjetasRetailReviewComponent } from './pages/review/tarjetas-retail/review.component';
import { ReviewComponent as GeneralReviewComponent } from './pages/review/general/review.component';
import { ReviewComponent as FullReviewComponent } from './pages/review/full/review.component';
import { RetroComponent } from './pages/retro/retro.component';
import { PlanningComponent } from './pages/planning/planning.component';


@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    LoginComponent,
    PlanningComponent,
    ReviewComponent,
    RetroComponent,
    ActivosComercialReviewComponent,
    GeneralReviewComponent,
    FullReviewComponent,
    ActivosJuridicoCoreReviewComponent,
    TarjetasRetailReviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
