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

      let provider = new firebase.auth.GoogleAuthProvider();
      //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

      this.angularFireAuth.signInWithPopup(provider).then(function (result: { user: any; }) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // The signed-in user info.
        let correos = ['linkjam06@gmail.com', 'jmorenoa@lafise.com'];
        let user = result.user;
       
        if(correos.includes(user.email)){
          localStorage.setItem('akdsjaoyiwer872482badhjduq2t', "1");
          resolve(user);
        }else{
          reject(user);
        }
        
        // ...
      }).catch(function (error: { code: any; message: any; email: any; credential: any; }) {
        // Handle Errors here.
        // let errorCode = error.code;
        // let errorMessage = error.message;
        // // The email of the user's account used.
        // let email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // let credential = error.credential;
        reject(error);
        // ...
      });
    })

  }

  /* Sign out */
  SignOut() {
    localStorage.removeItem("akdsjaoyiwer872482badhjduq2t");
    this.angularFireAuth.signOut().then((res) => {
      this.myRoute.navigate(['/login']);
    });
  }

  isAuthenticated() {
    let isAuth = localStorage.getItem('akdsjaoyiwer872482badhjduq2t') != null && localStorage.getItem('akdsjaoyiwer872482badhjduq2t') == "1";

    console.log(isAuth);
    return isAuth;
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
