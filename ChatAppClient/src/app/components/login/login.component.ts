import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent {
  name: string = "";

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

  }

  login() {
    this.http.get(`http://localhost:5082/api/Auth/Login?name=${this.name}`).subscribe(res => {
      localStorage.setItem("accessToken", JSON.stringify(res));
      this.router.navigateByUrl("/");
    });
   }
}
