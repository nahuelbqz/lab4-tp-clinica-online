import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  router = inject(Router);
  authService = inject(AuthService);
  toastServ = inject(ToastrService);

  cerrarSesion(): void {
    this.authService.logout();

    console.log('Sesion cerrada');
    this.toastServ.info('Sesion cerrada correctamente', 'Fin de sesion');

    this.router.navigateByUrl('/login');
  }
}
