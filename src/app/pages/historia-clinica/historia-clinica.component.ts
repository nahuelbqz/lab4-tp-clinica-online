import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EspecialidadService } from '../../services/especialidad.service';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { EspecialidadInterfaceId } from '../../interfaces/especialidad';
import { turnoInterfaceId } from '../../interfaces/turno';
import jsPDF from 'jspdf';
import { HistoriaClinicaInterfaceId } from '../../interfaces/historia-clinica';
import { EspecialistaInterfaceId } from '../../interfaces/especialista';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css',
})
export class HistoriaClinicaComponent {
  authService = inject(AuthService);
  historialService = inject(HistoriaClinicaService);
  turnosService = inject(TurnosService);
  especialidadService = inject(EspecialidadService);
  fb = inject(FormBuilder);

  arrayEspecialidades?: EspecialidadInterfaceId[];
  arrayEspecialistas: EspecialistaInterfaceId[] = [];

  listaHistorial: HistoriaClinicaInterfaceId[] = [];
  listaTurnos: turnoInterfaceId[] = [];

  form = this.fb.nonNullable.group({
    especialista: ['', Validators.required],
  });

  ngOnInit(): void {
    setTimeout(() => {
      const currentUser = this.authService.currentUserSig();
      if (currentUser?.rol === 'paciente') {
        const userEmail = currentUser.email;
        if (userEmail) {
          this.historialService.getHistoriaClinica().subscribe((data) => {
            this.listaHistorial = data.filter((historial) => {
              return historial.mailPaciente === userEmail;
            });
          });
          this.turnosService.getTurnos().subscribe((data) => {
            this.listaTurnos = data;
          });
        }
      } else if (currentUser?.rol === 'especialista') {
        this.historialService.getHistoriaClinica().subscribe((data) => {
          this.listaHistorial = [];
          this.authService
            .getUsuarioId(currentUser.email)
            .then((usuarioEspecialista) => {
              if (usuarioEspecialista) {
                usuarioEspecialista.usuariosAtentidos.forEach(
                  (usuarioPaciente: string) => {
                    data.forEach((historial) => {
                      if (historial.mailPaciente == usuarioPaciente) {
                        this.listaHistorial.push(historial);
                      }
                    });
                  }
                );
              }
            });
        });
      } else if (currentUser?.rol === 'admin') {
        const userEmail = currentUser.email;
        if (userEmail) {
          this.historialService.getHistoriaClinica().subscribe((data) => {
            this.listaHistorial = data;
          });
        }
      }
    }, 2000);

    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.arrayEspecialidades = data;
    });

    this.authService.getUsuarios().subscribe((data) => {
      this.arrayEspecialistas = data.filter(
        (usuario) => usuario.rol === 'especialista'
      );
    });
  }

  onSummitEspecialista() {
    if (this.form.valid) {
      const selectedEspecialista = this.form.getRawValue().especialista;
      const listaFiltrada: HistoriaClinicaInterfaceId[] =
        this.listaHistorial.filter(
          (historial) => historial.mailEspecialistas === selectedEspecialista
        );

      listaFiltrada.forEach((historial) => {
        this.descargarPDF(historial);
      });
    }
  }

  descargarPDF(historial: HistoriaClinicaInterfaceId) {
    const doc = new jsPDF();
    doc.addImage('assets/hospital-logo-icons8.png', 'PNG', 10, 10, 30, 30);
    doc.setFont('Courier');
    doc.setFontSize(50);
    doc.text('Clinica online', 45, 30);

    doc.setFontSize(30);
    doc.text('Historia Clinica', 10, 60);

    doc.setFontSize(25);
    doc.text(`Paciente: ${historial.mailPaciente}`, 10, 80);
    doc.text(`Especialista: ${historial.mailEspecialistas}`, 10, 90);

    doc.setFontSize(20);
    doc.text(`Altura: ${historial.altura}`, 10, 100);
    doc.text(`Peso: ${historial.peso}`, 10, 110);
    doc.text(`Temperatura: ${historial.temperatura}`, 10, 120);
    doc.text(`Presion: ${historial.presion}`, 10, 130);
    doc.text(
      `${historial.arrayObservaciones[0]}: ${historial.arrayObservaciones[1]}`,
      10,
      140
    );
    doc.text(
      `${historial.arrayObservaciones[2]}: ${historial.arrayObservaciones[3]}`,
      10,
      150
    );
    doc.text(
      `${historial.arrayObservaciones[4]}: ${historial.arrayObservaciones[5]}`,
      10,
      160
    );

    doc.text(`${this.obtenerFechaActual()}`, 10, 190);
    doc.save(`${historial.mailPaciente}_historial_clinica.pdf`);
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    return `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}`;
  }
}
