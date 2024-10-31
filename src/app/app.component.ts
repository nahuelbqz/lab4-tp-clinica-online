import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'clinica-online-tp';
  authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.user$.subscribe(
      (user: { email: string | null | undefined; emailVerified: any }) => {
        if (user) {
          this.authService.getUsuario(user.email).then((res) => {
            if (res.rol != 'admin') {
              //compruebo si verificaron el mail los que NO son admin
              if (user.emailVerified) {
                this.authService.currentUserSig.set({
                  email: user.email!,
                  rol: res.rol,
                });
                console.log(this.authService.currentUserSig());
              }
            } else {
              this.authService.currentUserSig.set({
                email: user.email!,
                rol: res.rol,
              });
              console.log(this.authService.currentUserSig());
            }
          });
        } else {
          this.authService.currentUserSig.set(null);
          console.log(this.authService.currentUserSig());
        }
      }
    );
  }
}
