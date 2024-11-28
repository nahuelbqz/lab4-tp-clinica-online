import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TurnosService } from '../../services/turnos.service';
import { turnoInterface } from '../../interfaces/turno';
import jsPDF from 'jspdf';

interface TurnosAgrupadosEspecialista {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-info-turno-por-dia',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './info-turno-por-dia.component.html',
  styleUrl: './info-turno-por-dia.component.css',
})
export class InfoTurnoPorDiaComponent {
  turnosService = inject(TurnosService);

  fechasUnicas: string[] = [];
  fechaSeleccionada: string = '';

  single: any[] = [];
  view: [number, number] = [500, 400];
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme: string = 'horizon';
  legenTitle = 'Especialidades';

  turnosAux: turnoInterface[] = [];

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.turnosAux = data;

      this.fechasUnicas = Array.from(
        new Set(data.map((turno) => turno.date))
      ).sort();

      if (this.fechasUnicas.length > 0) {
        this.fechaSeleccionada = this.fechasUnicas[0];
        this.actualizarTurnosParaFecha(this.fechaSeleccionada);
      }
    });
  }

  actualizarTurnosParaFecha(fecha: string): void {
    this.single = this.agruparTurnosPorEspecialista(
      this.turnosAux.filter((turno) => turno.date === fecha)
    );
  }

  agruparTurnosPorEspecialista(
    turnos: turnoInterface[]
  ): TurnosAgrupadosEspecialista[] {
    const agrupados = turnos.reduce((acc, turno) => {
      if (turno.especialista != undefined) {
        if (!acc[turno.especialista]) {
          acc[turno.especialista] = 0;
        }
        acc[turno.especialista]++;
      }
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(agrupados).map((especialista) => ({
      name: especialista,
      value: agrupados[especialista],
    }));
  }

  descargarPDF(turnos: TurnosAgrupadosEspecialista[]) {
    const doc = new jsPDF();
    doc.addImage('assets/hospital-logo-icons8.png', 'PNG', 10, 10, 30, 30);
    doc.setFont('Courier');
    doc.setFontSize(50);
    doc.text('Clinica online', 45, 30);

    doc.setFontSize(30);
    doc.text('Turnos por dia: ' + this.fechaSeleccionada, 10, 55);

    doc.setFontSize(18);
    let y = 60;

    turnos.forEach((turno) => {
      y += 10;
      doc.text(`Especialista: ${turno.name} Turnos: ${turno.value}`, 10, y);
    });

    doc.text(`Generado el: ${this.obtenerFechaActual()}`, 10, 170);
    doc.save(`Turnos_clinica.pdf`);
  }

  obtenerFechaActual(): string {
    const fecha = new Date();

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();

    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  }
}
