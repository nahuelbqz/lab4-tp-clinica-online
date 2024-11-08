import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EspecialistaInterface } from '../../interfaces/especialista';
import { turnoInterface, turnoInterfaceId } from '../../interfaces/turno';
import { HistorialClinicaService } from '../../services/historial-clinica.service';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css',
})
export class MisTurnosComponent {
  authService = inject(AuthService);
  turnosService = inject(TurnosService);
  historialService = inject(HistorialClinicaService);
  toastAlert = inject(ToastrService);
  router = inject(Router);
  spinner: boolean = false;
  listaTurnosPacientes: turnoInterfaceId[] = [];
  listaTurnosPacientesFiltrado: turnoInterfaceId[] = [];

  buscarString: string = '';

  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      if (this.authService.currentUserSig()?.rol == 'paciente') {
        this.turnosService.getTurnos().subscribe((data) => {
          this.listaTurnosPacientes = data.filter((r) => {
            return r.paciente == this.authService.currentUserSig()?.email;
          });
          this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes;
          this.buscarString = '';
        });
      } else if (this.authService.currentUserSig()?.rol == 'especialista') {
        this.turnosService.getTurnos().subscribe((data) => {
          this.listaTurnosPacientes = data.filter((r) => {
            return r.especialista == this.authService.currentUserSig()?.email;
          });
          this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes;
          this.buscarString = '';
        });
      }
      this.spinner = false;
    }, 2000);
  }

  async onBuscar() {
    this.listaTurnosPacientesFiltrado = [];
    const term = this.buscarString.toLowerCase();
    if (
      this.authService.currentUserSig()?.rol == 'paciente' ||
      this.authService.currentUserSig()?.rol == 'especialista'
    ) {
      // Agregar filtro historial
      this.listaTurnosPacientes.forEach(async (turno) => {
        let esValido: boolean = false;
        if (
          turno.especialidad?.toLowerCase().includes(term) ||
          turno.especialista?.toLowerCase().includes(term) ||
          turno.paciente?.toLowerCase().includes(term)
        ) {
          esValido = true;
        }
        if (esValido) {
          this.listaTurnosPacientesFiltrado.push(turno);
        }
      });
    }
  }

  // Botones
  pacienteCancelarTurno(turno: turnoInterfaceId) {
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
        this.modificarEstadoComentarioPaciente(
          'cancelado',
          result.value,
          turno
        );
      }
    });
  }

  pacienteVerResena(turno: turnoInterfaceId) {
    Swal.fire({
      title: 'Reseña del especialista',
      confirmButtonColor: '#3085d6',
      text: turno.comentarioEspecialista,
    });
  }
  pacienteCompletarEncuesta(turno: turnoInterfaceId) {
    Swal.fire({
      title: 'Mensaje de encuesta',
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
        this.modificarEncuestaPaciente(result.value, turno);
      }
    });
  }
  pacienteCalificarAtencion(turno: turnoInterfaceId) {
    Swal.fire({
      title: 'Calificacion de atencion',
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
        this.modificarComentarioPaciente(result.value, turno);
      }
    });
  }

  especialistaCancelarTurno(turno: turnoInterfaceId) {
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
  especialistaRechazarTruno(turno: turnoInterfaceId) {
    Swal.fire({
      title: 'Motivo de rechazo',
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
          'rechazado',
          result.value,
          turno
        );
      }
    });
  }
  especialistaAceptarTurno(turno: turnoInterfaceId) {
    Swal.fire({
      title: 'Desea aceptar el turno?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.modificarEstadoEspecialista('aceptado', turno);
      }
    });
  }
  especialistaFinalizarTurno(turno: turnoInterfaceId) {
    if (
      turno.paciente != undefined &&
      turno.especialista != undefined &&
      turno.id != undefined &&
      turno.especialidad != undefined
    ) {
      this.historialService.mailPaciente = turno.paciente;
      this.historialService.mailEspecialista = turno.especialista;
      this.historialService.idTurno = turno.id;
      this.historialService.especialidadEspecialista = turno.especialidad;
    }
    Swal.fire({
      title: 'Mensaje de finalizacion',
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
        this.authService.getUsuarioId(turno.especialista).then((r) => {
          const arrayAux: string[] = r.usuariosAtentidos;
          const existe = arrayAux.some((user) => user == turno.paciente);
          if (!existe && turno.paciente) {
            arrayAux.push(turno.paciente);
          }
          const especialistaAix: EspecialistaInterface = {
            nombre: r.nombre,
            apellido: r.apellido,
            edad: r.edad,
            dni: r.dni,
            especialidad: r.especialidad,
            mail: r.mail,
            imagenUno: r.imagenUno,
            rol: r.rol,
            estaValidado: r.estaValidado,
            deSemana: r.deSemana,
            hastaSemana: r.hastaSemana,
            deSabado: r.deSabado,
            hastaSabado: r.hastaSabado,
            usuariosAtentidos: arrayAux,
          };
          this.authService.updateUsuarioEspecialista(r.id, especialistaAix);
        });
        this.modificarEstadoComentarioEspecialista(
          'realizado',
          result.value,
          turno
        );
        this.router.navigateByUrl('/historial-clinica');
      }
    });
  }
  // Aux
  modificarEstadoComentarioPaciente(
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
      comentarioPaciente: comentarioTurno,
      comentarioEspecialista: turno.comentarioEspecialista,
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
  modificarEncuestaPaciente(encuesta: string, turno: turnoInterfaceId) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: turno.estado,
      encuestaPaciente: encuesta,
      comentarioPaciente: turno.comentarioPaciente,
      comentarioEspecialista: turno.comentarioEspecialista,
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
  modificarComentarioPaciente(comentario: string, turno: turnoInterfaceId) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: turno.estado,
      encuestaPaciente: turno.encuestaPaciente,
      comentarioPaciente: comentario,
      comentarioEspecialista: turno.comentarioEspecialista,
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
  modificarEstadoEspecialista(estadoTurno: string, turno: turnoInterfaceId) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: estadoTurno,
      encuestaPaciente: turno.encuestaPaciente,
      comentarioPaciente: turno.comentarioPaciente,
      comentarioEspecialista: turno.comentarioEspecialista,
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
