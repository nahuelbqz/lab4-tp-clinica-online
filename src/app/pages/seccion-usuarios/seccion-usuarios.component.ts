import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EspecialistaInterfaceId } from '../../interfaces/especialista';
import { PacienteInterfaceId } from '../../interfaces/paciente';
import { TurnosService } from '../../services/turnos.service';
import { turnoInterfaceId } from '../../interfaces/turno';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css',
})
export class SeccionUsuariosComponent {
  authService = inject(AuthService);
  turnosService = inject(TurnosService);
  usuarios: any[] = [];
  listaEspecialistas: EspecialistaInterfaceId[] = [];
  listaPacientes: PacienteInterfaceId[] = [];
  listaTurnos: turnoInterfaceId[] = [];

  ngOnInit() {
    this.authService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.listaEspecialistas = data.filter(
        (usuario) => usuario.rol === 'especialista'
      );
      this.listaPacientes = data.filter(
        (usuario) => usuario.rol === 'paciente'
      );
    });
    this.turnosService.getTurnos().subscribe((data) => {
      this.listaTurnos = data;
    });
  }

  validarEspecialista(especialista: any) {
    let estaValidadoAux: boolean;
    if (especialista.estaValidado) {
      estaValidadoAux = false;
    } else {
      estaValidadoAux = true;
    }
    const auxEspecialista = {
      nombre: especialista.nombre,
      apellido: especialista.apellido,
      edad: especialista.edad,
      dni: especialista.dni,
      especialidad: especialista.especialidad,
      mail: especialista.mail,
      imagenUno: especialista.imagenUno,
      rol: especialista.rol,
      estaValidado: estaValidadoAux,
      //params
    };
    this.authService.updateUsuarioEspecialista(
      especialista.id,
      auxEspecialista
    );
  }
}
