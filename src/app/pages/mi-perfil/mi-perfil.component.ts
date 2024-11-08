import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent {
  authService = inject(AuthService);

  spinner: boolean = false;
  usuarioActual: any;

  ngOnInit(): void {
    this.spinner = true;

    setTimeout(() => {
      this.authService
        .getUsuario(this.authService.currentUserSig()?.email)
        .then((r) => {
          this.usuarioActual = r;
        });

      this.spinner = false;
    }, 2000);
  }
}
