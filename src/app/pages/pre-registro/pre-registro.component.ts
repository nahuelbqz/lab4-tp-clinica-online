import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pre-registro',
  standalone: true,
  imports: [],
  templateUrl: './pre-registro.component.html',
  styleUrl: './pre-registro.component.css',
})
export class PreRegistroComponent {
  router = inject(Router);
  authService = inject(AuthService);
  spinner: boolean = false;
  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 1500);
  }

  cambiarResultado(resultado: string) {
    if (resultado == 'paciente') {
      this.router.navigateByUrl('/registro-paciente');
    } else if (resultado == 'especialista') {
      this.router.navigateByUrl('/registro-especialista');
    } else if (resultado == 'admin') {
      this.router.navigateByUrl('/registro-admin');
    }
  }
}
