import { Component, inject } from '@angular/core';
import { turnoInterface } from '../../interfaces/turno';
import { TurnosService } from '../../services/turnos.service';
import jsPDF from 'jspdf';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface TurnosAgrupadosEspecialidad {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-info-turno-por-especialidad',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './info-turno-por-especialidad.component.html',
  styleUrl: './info-turno-por-especialidad.component.css',
})
export class InfoTurnoPorEspecialidadComponent {
  turnosService = inject(TurnosService);

  single: any[] = [];
  view: [number, number] = [500, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Especialidad';
  showYAxisLabel = true;
  yAxisLabel = 'Turno';
  colorScheme: string = 'horizon';
  legenTitle = 'Especialidades';

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.single = this.agruparTurnosPorEspecialidad(data);
    });
  }
  onSelect(event: any) {
    console.log(event);
  }

  agruparTurnosPorEspecialidad = (
    turnos: turnoInterface[]
  ): TurnosAgrupadosEspecialidad[] => {
    const agrupados = turnos.reduce((acc, turno) => {
      if (turno.especialidad != undefined) {
        if (!acc[turno.especialidad]) {
          acc[turno.especialidad] = 0;
        }
        acc[turno.especialidad]++;
      }
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(agrupados).map((especialidad) => ({
      name: especialidad,
      value: agrupados[especialidad],
    }));
  };

  descargarPDF(turnos: TurnosAgrupadosEspecialidad[]) {
    const doc = new jsPDF();

    doc.addImage('assets/hospital-logo-icons8.png', 'PNG', 10, 10, 30, 30);
    doc.setFont('Courier');
    doc.setFontSize(50);
    doc.text('Clinica online', 45, 30);

    doc.setFontSize(30);
    doc.text('Turnos por especialidad', 10, 55);

    doc.setFontSize(18);
    let y = 60;

    turnos.forEach((turno) => {
      y += 10;
      doc.text(`${turno.name} Cantidad: ${turno.value}`, 10, y);
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
