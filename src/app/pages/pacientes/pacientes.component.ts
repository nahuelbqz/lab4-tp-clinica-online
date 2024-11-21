import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import { EspecialidadInterfaceId } from '../../interfaces/especialidad';
import { HistoriaClinicaInterfaceId } from '../../interfaces/historia-clinica';
import { turnoInterfaceId } from '../../interfaces/turno';
import { AuthService } from '../../services/auth.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { TurnosService } from '../../services/turnos.service';
import { PacienteInterfaceId } from '../../interfaces/paciente';
import { NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent {
  private authService = inject(AuthService);
  private historialService = inject(HistoriaClinicaService);
  private turnosService = inject(TurnosService);
  private especialidadService = inject(EspecialidadService);

  arrayEspecialidades: EspecialidadInterfaceId[] = [];
  listaHistorial: HistoriaClinicaInterfaceId[] = [];
  listaTurnos: turnoInterfaceId[] = [];
  listaPacientesAtendidos: PacienteInterfaceId[] = [];
  historialActivo: HistoriaClinicaInterfaceId[] = [];
  pacienteSeleccionado: PacienteInterfaceId | null = null;

  ngOnInit(): void {
    this.loadEspecialidades();
    this.loadUserData();
  }

  private loadEspecialidades(): void {
    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.arrayEspecialidades = data;
    });
  }

  private loadUserData(): void {
    const currentUser = this.authService.currentUserSig();

    if (!currentUser) return;

    if (currentUser.rol === 'paciente') {
      this.loadPatientData(currentUser.email);
    } else if (currentUser.rol === 'especialista') {
      this.loadEspecialistaData(currentUser.email);
    } else if (currentUser.rol === 'admin') {
      this.loadAdminData();
    }
  }

  private loadPatientData(email: string): void {
    this.historialService.getHistoriaClinica().subscribe((data) => {
      this.listaHistorial = data.filter(
        (historial) => historial.mailPaciente === email
      );
    });
    this.loadTurnos();
  }

  private loadEspecialistaData(email: string): void {
    this.historialService.getHistoriaClinica().subscribe((data) => {
      this.authService.getUsuarioId(email).then((especialista) => {
        if (especialista) {
          especialista.usuariosAtentidos.forEach((mailPaciente: string) => {
            data.forEach((historial) => {
              if (historial.mailPaciente === mailPaciente) {
                this.listaHistorial.push(historial);
              }
            });
          });
        }
      });
    });
    this.loadTurnos();
    this.loadPacientesAtendidos(email);
  }

  private loadAdminData(): void {
    this.historialService.getHistoriaClinica().subscribe((data) => {
      this.listaHistorial = data;
    });
  }

  private loadTurnos(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.listaTurnos = data;
    });
  }

  private loadPacientesAtendidos(emailEspecialista: string): void {
    this.authService.getUsuarioId(emailEspecialista).then((especialista) => {
      if (especialista) {
        especialista.usuariosAtentidos.forEach((mailPaciente: string) => {
          this.authService.getUsuario(mailPaciente).then((paciente) => {
            if (paciente) this.listaPacientesAtendidos.push(paciente);
          });
        });
      }
    });
  }

  verHistorialPaciente(paciente: PacienteInterfaceId): void {
    this.pacienteSeleccionado = paciente;
    this.historialService.getHistoriaClinica().subscribe((data) => {
      this.historialActivo = data.filter(
        (historial) => historial.mailPaciente === paciente.mail
      );
    });
  }

  pacienteVerResena(historial: HistoriaClinicaInterfaceId): void {
    const turnoRelacionado = this.listaTurnos.find(
      (turno) => turno.id === historial.idTurno
    );

    if (turnoRelacionado) {
      Swal.fire({
        title: 'Reseña del especialista',
        text:
          turnoRelacionado.comentarioEspecialista ||
          'No hay comentarios disponibles',
        icon: 'info',
        confirmButtonColor: '#3085d6',
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró la reseña para este turno',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  }
}
