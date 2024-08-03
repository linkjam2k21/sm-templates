import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario Válido', this.loginForm.value);
      // Aquí puedes agregar el manejo de la autenticación
      this.auth.SignIn().then(res => {

        console.log(res);
        this.router.navigate(['/main/planning']);

        
        //this.loadingVisible = false;
        //this.router.config[1].children = FullLayout.getFullRoutes(8);
  
        // this.userService.getUser(res.email).subscribe(resOne => {
        //   let user = resOne as UserModel;
  
        //   if (user == undefined) user = new UserModel();
  
        //   user.email = res.email;
        //   user.name = res.displayName;
        //   user.photo = res.photoURL;
        //   user.loginDate = new Date();
  
        //   if (this.creatingUser) {
        //     return;
        //   } else {
        //     this.creatingUser = true;
        //   }
  
        //   this.userService.createUser(user).subscribe(resCreate => {
        //     this.auth.setUserData(user);
        //     this.router.config[1].children = FullLayout.getFullRoutes(user.userType);
        //     this.router.navigate(['/scrum/assessment']);
        //   });
  
        // });
  
        //this.router.navigate(['/dashboards/admin']);
  
      }, fail => {
        // this.loadingVisible = false;
        // this.ValidacionMensaje = JSON.parse(fail);
        // notify(this.ValidacionMensaje, 'error', 3000);
      });
    } else {
      console.log('Formulario Inválido');
      this.loginForm.markAllAsTouched();
    }
  }
}
