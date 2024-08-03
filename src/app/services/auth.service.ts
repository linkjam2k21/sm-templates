import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
//import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private myRoute: Router, private angularFireAuth: AngularFireAuth) {
  }

  /* Sign in */
  SignIn() {

    return new Promise<any>((resolve, reject) => {

      var provider = new firebase.auth.GoogleAuthProvider();
      //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

        this.angularFireAuth.signInWithPopup(provider).then(function (result: { user: any; }) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // The signed-in user info.
        var user = result.user;
        resolve(user);
        // ...
      }).catch(function (error: { code: any; message: any; email: any; credential: any; }) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        reject(error);
        // ...
      });
    })

  }

  /* Sign out */
  SignOut() {
    this.angularFireAuth
      .signOut();
  }

  setUserData(token: any) {
    localStorage.setItem('UDATA', JSON.stringify(token));
  }

//   getUserData() {
//     let data = JSON.parse(localStorage.getItem('UDATA'));
//     return data;
//   }

//   sendToken(token: string) {
//     localStorage.setItem('LoggedInUser', token);
//   }

//   getToken() {
//     return localStorage.getItem('LoggedInUser');
//   }

//   removeToken() {
//     return localStorage.removeItem('LoggedInUser');
//   }

//   isLoggedIn() {
//     if (this.getToken() == null) {
//       return false;
//     }

//     return this.getToken() !== null;
//   }

//   logout() {
//     localStorage.removeItem('LoggedInUser');
//     this.myRoute.navigate(['Login']);
//   }

}
