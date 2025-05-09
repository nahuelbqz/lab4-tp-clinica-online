import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EspecialistaInterfaceId } from '../../interfaces/especialista';
import { PacienteInterfaceId } from '../../interfaces/paciente';
import { turnoInterface, turnoInterfaceId } from '../../interfaces/turno';
import { EspecialidadService } from '../../services/especialidad.service';
import { TurnosService } from '../../services/turnos.service';
import { AuthService } from '../../services/auth.service';
import { EspecialidadInterfaceId } from '../../interfaces/especialidad';
import { hourFormatPipe } from '../../pipes/hour-format.pipe';
import { DayFormatPipe } from '../../pipes/day-format.pipe';
import { EspecialidadImagenPipe } from '../../pipes/especialidad-imagen.pipe';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [FormsModule, DayFormatPipe, hourFormatPipe, EspecialidadImagenPipe],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
})
export class SolicitarTurnoComponent {
  fb = inject(FormBuilder);
  especialidadService = inject(EspecialidadService);
  authService = inject(AuthService);
  turnosService = inject(TurnosService);
  toastAlert = inject(ToastrService);
  router = inject(Router);

  futureDays: {
    date: string;
    day: string;
    buttons: { time: string; selected: boolean }[];
  }[] = [];
  selectedDate: string | null = null;
  selectedDay: {
    date: string;
    day: string;
    buttons: { time: string; selected: boolean }[];
  } | null = null;

  arrayEspecialidades?: EspecialidadInterfaceId[];
  usuariosEspecialistas: EspecialistaInterfaceId[] = [];
  usuariosEspecialistasFiltrado: EspecialistaInterfaceId[] = [];
  usuariosPacientes: PacienteInterfaceId[] = [];
  turnos: turnoInterfaceId[] = [];
  turnosFiltrados: turnoInterfaceId[] = [];

  especialistaElegido?: string;
  especialidadElegida?: string;
  turnosElegidos: any[] = [];
  pacienteElegido?: string;
  especialidadString?: string;

  especialidadesFiltradas: EspecialidadInterfaceId[] = []; // Nueva variable para almacenar especialidades filtradas por especialista

  ngOnInit() {
    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.arrayEspecialidades = data;
    });
    this.authService.getUsuarios().subscribe((data) => {
      this.usuariosEspecialistas = data.filter(
        (usuario) => usuario.rol === 'especialista'
      );
      this.usuariosPacientes = data.filter(
        (usuario) => usuario.rol === 'paciente'
      );
    });
    this.turnosService.getTurnos().subscribe((data) => {
      this.turnos = data;
    });
  }

  clickEspecialista(usuario: EspecialistaInterfaceId) {
    this.especialistaElegido = usuario.mail;
    this.especialidadesFiltradas =
      this.arrayEspecialidades?.filter((especialidad) =>
        usuario.especialidad.includes(especialidad.nombre)
      ) || [];

    this.filtrarTurnosPorEspecialista(this.especialistaElegido);
    this.calculateFutureDays(usuario);
    console.log('Especialista seleccionado:', usuario);
  }

  clickEspecialidad(nombreEspecialidad: string) {
    if (nombreEspecialidad) {
      this.especialidadString = nombreEspecialidad;
      this.especialidadElegida = nombreEspecialidad;

      this.filtrarTurnosPorEspecialista(this.especialistaElegido);
      console.log('Especialidad seleccionada:', nombreEspecialidad);
    }
  }
  clickPaciente(usuario: any) {
    this.pacienteElegido = usuario.mail;
  }

  filtrarTurnosPorEspecialista(mailEspecialista: string | undefined) {
    if (mailEspecialista) {
      this.turnosFiltrados = this.turnos.filter(
        (turno) => turno.especialista == mailEspecialista
      );
    } else {
      console.log('no existe especialista con ese mail');
    }
  }

  // Botones
  calculateFutureDays(usuario: any): void {
    this.futureDays = [];
    const daysOfWeek = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);

      // Omitir si es domingo
      if (futureDate.getDay() === 0) {
        continue;
      }

      const dayOfWeek = daysOfWeek[futureDate.getDay()];
      const buttons = this.generateButtons(futureDate, usuario);

      this.futureDays.push({
        date: this.formatDate(futureDate),
        day: dayOfWeek,
        buttons: buttons,
      });
    }
  }

  generateButtons(
    date: Date,
    usuario: any
  ): { time: string; selected: boolean }[] {
    const buttons: { time: string; selected: boolean }[] = [];
    let startHour, endHour;
    const dayOfWeek = date.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Lunes a Viernes
      startHour = usuario.deSemana;
      endHour = usuario.hastaSemana;
    } else if (dayOfWeek === 6) {
      // Sábados
      startHour = usuario.deSabado;
      endHour = usuario.hastaSabado;
    } else {
      // Domingo no genera botones
      return buttons;
    }

    for (let hour = startHour; hour <= endHour; hour++) {
      this.addAvailableButton(buttons, date, hour, 0);
      if (hour !== endHour) {
        this.addAvailableButton(buttons, date, hour, 30);
      }
    }

    return buttons;
  }

  addAvailableButton(
    buttons: { time: string; selected: boolean }[],
    date: Date,
    hour: number,
    minute: number
  ): void {
    const time = this.formatTime(hour, minute);
    const formattedDate = this.formatDate(date);

    // Verifica si el turno esta tomado
    const turnoTomado = this.turnosFiltrados.some(
      (turno) => turno.date === formattedDate && turno.time === time
    );

    if (!turnoTomado) {
      buttons.push({ time, selected: false });
    }
  }

  formatDate(date: Date): string {
    const day =
      date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : `${date.getMonth() + 1}`;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  formatTime(hour: number, minute: number): string {
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
    return `${hourStr}:${minuteStr}`;
  }
  onHourClick(dateBtn: string, timeBtn: string): void {
    if (this.selectedDay) {
      this.selectedDay.buttons.forEach((button) => {
        if (button.time === timeBtn) {
          if (!button.selected) {
            this.turnosElegidos.push({ date: dateBtn, time: timeBtn });
          } else {
            const index = this.turnosElegidos.findIndex(
              (b) => b.time === timeBtn && b.date === dateBtn
            );
            if (index !== -1) {
              this.turnosElegidos.splice(index, 1);
            }
          }
          button.selected = !button.selected;
        }
      });
    }
    console.log(this.turnosElegidos);
  }
  onDayClick(dayA: any): void {
    this.selectedDay = this.futureDays.find((day) => day.date === dayA) || null;
    this.resetButtons();
  }
  resetButtons(): void {
    if (this.selectedDay) {
      this.selectedDay.buttons.forEach((button) => {
        button.selected = false;
      });
    }
    this.turnosElegidos = [];
  }
  onDayAndHourClick(dateBtn: string, timeBtn: string): void {
    const day = this.futureDays.find((d) => d.date === dateBtn);

    if (day) {
      const button = day.buttons.find((btn) => btn.time === timeBtn);
      if (button) {
        button.selected = !button.selected;

        if (button.selected) {
          this.turnosElegidos.push({ date: dateBtn, time: timeBtn });
        } else {
          const index = this.turnosElegidos.findIndex(
            (b) => b.time === timeBtn && b.date === dateBtn
          );
          if (index !== -1) {
            this.turnosElegidos.splice(index, 1);
          }
        }
      }
    }

    console.log(this.turnosElegidos);
  }

  reservar() {
    if (this.especialistaElegido && this.especialidadElegida) {
      if (this.turnosElegidos.length == 0) {
        this.toastAlert.error('No hay ningun turno', 'Error');
      } else {
        let savePromises: Promise<void>[] = [];

        this.turnosElegidos.forEach((btn) => {
          if (this.authService.currentUserSig()?.rol == 'admin') {
            if (this.pacienteElegido) {
              const turnoAux: turnoInterface = {
                date: btn.date,
                time: btn.time,
                paciente: this.pacienteElegido,
                especialista: this.especialistaElegido,
                especialidad: this.especialidadElegida,
                estado: 'pendiente',
                encuestaPaciente: '',
                comentarioPaciente: '',
                comentarioEspecialista: '',
              };
              savePromises.push(
                this.turnosService
                  .saveTurno(turnoAux)
                  .then(() => {
                    this.toastAlert.success('Reservacion completada', 'Exito');
                    console.log('Reservacion completada');
                  })
                  .catch(() => {
                    this.toastAlert.error('Error al crear un Turno', 'Error');
                    console.log('Error al crear un Turno');
                  })
              );
            } else {
              this.toastAlert.error('Falta elegir paciente', 'Error');
              console.log('Falta elegir paciente');
            }
          } else if (this.authService.currentUserSig()?.rol == 'paciente') {
            const turnoAux: turnoInterface = {
              date: btn.date,
              time: btn.time,
              paciente: this.authService.currentUserSig()?.email,
              especialista: this.especialistaElegido,
              especialidad: this.especialidadElegida,
              estado: 'pendiente',
              encuestaPaciente: '',
              comentarioPaciente: '',
              comentarioEspecialista: '',
            };
            savePromises.push(
              this.turnosService
                .saveTurno(turnoAux)
                .then(() => {
                  this.toastAlert.success('Reserva completada', 'Exito');
                  console.log('Reserva completada');
                })
                .catch(() => {
                  this.toastAlert.error('Error al crear un Turno', 'Error');
                  console.log('Error al crear un Turno');
                })
            );
          } else {
            console.log('no hay rol');
          }
        });

        Promise.all(savePromises).then(() => {
          this.router.navigate(['/bienvenida']);
        });
      }
    } else {
      this.toastAlert.error('Faltan selecionar datos', 'Error');
    }
  }
}
