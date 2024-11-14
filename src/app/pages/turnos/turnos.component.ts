import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { turnoInterface, turnoInterfaceId } from '../../interfaces/turno';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css',
})
export class TurnosComponent {
  authService = inject(AuthService);
  turnosService = inject(TurnosService);
  toastAlert = inject(ToastrService);

  listaTurnosPacientes: turnoInterfaceId[] = [];
  listaTurnosPacientesFiltrado: turnoInterfaceId[] = [];
  buscarString: string = '';
  spinner: boolean = false;

  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      if (this.authService.currentUserSig()?.rol == 'admin') {
        this.turnosService.getTurnos().subscribe((data) => {
          this.listaTurnosPacientes = data;
          this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes;
          this.buscarString = '';
        });
      }
      this.spinner = false;
    }, 2000);
  }

  onBuscar() {
    const term = this.buscarString.toLowerCase();
    this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes.filter(
      (turno) =>
        turno.especialidad?.toLowerCase().includes(term) ||
        turno.especialista?.toLowerCase().includes(term)
    );
  }

  // Botones
  adminCancelarTurno(turno: turnoInterfaceId) {
    Swal.fire({
      title: 'Motivo de cancelacion',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      showLoaderOnConfirm: true,
      preConfirm: async (r) => {
        return r;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // Modificar
        console.log(result);
        this.modificarEstadoComentarioEspecialista(
          'cancelado',
          result.value,
          turno
        );
      }
    });
  }

  // Aux
  modificarEstadoComentarioEspecialista(
    estadoTurno: string,
    comentarioTurno: string,
    turno: turnoInterfaceId
  ) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: estadoTurno,
      encuestaPaciente: turno.encuestaPaciente,
      comentarioPaciente: turno.comentarioPaciente,
      comentarioEspecialista: comentarioTurno,
    };
    this.turnosService
      .updateTurno(turno.id, turnoAux)
      .then(() => {
        this.toastAlert.success('Se modifico Correctamente', 'Exito');
      })
      .catch(() => {
        this.toastAlert.error('No se pudo Modificar', 'Error');
      });
  }
}
