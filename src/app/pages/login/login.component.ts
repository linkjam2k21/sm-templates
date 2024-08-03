import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  constructor(private auth: AuthService, private router: Router) {
  }


  onSubmit() {
    // Aquí puedes agregar el manejo de la autenticación
    this.auth.SignIn().then(res => {

      console.log(res);
      this.router.navigate(['/main/planning']);

    }, fail => {
      alert('No tiene acceso a usar este portal');
    });

  }
}
