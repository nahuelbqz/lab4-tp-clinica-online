import { Component, inject } from '@angular/core';
import jsPDF from 'jspdf';
import { turnoInterface } from '../../interfaces/turno';
import { TurnosService } from '../../services/turnos.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

interface TurnosAgrupadosEspecialista {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-info-turnos-solicitados-por-medico',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './info-turnos-solicitados-por-medico.component.html',
  styleUrl: './info-turnos-solicitados-por-medico.component.css',
})
export class InfoTurnosSolicitadosPorMedicoComponent {
  private turnosService = inject(TurnosService);

  startDate: string = '1/1/2024';
  endDate: string = '30/12/2025';
  single: TurnosAgrupadosEspecialista[] = [];
  turnosAux: turnoInterface[] = [];

  // Configuración del gráfico
  view: [number, number] = [600, 400];
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = true;
  colorScheme: string = 'horizon';

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.turnosAux = data;
      this.single = this.agruparTurnosPorEspecialista(data);
    });
  }

  clickBuscar() {
    this.single = this.agruparTurnosPorEspecialista(this.turnosAux);
  }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  private agruparTurnosPorEspecialista(
    turnos: turnoInterface[]
  ): TurnosAgrupadosEspecialista[] {
    const start = this.parseDate(this.startDate);
    const end = this.parseDate(this.endDate);

    const turnosEnLapso = turnos.filter((turno) => {
      const turnoDate = this.parseDate(turno.date);
      return turnoDate >= start && turnoDate <= end;
    });

    const agrupados = turnosEnLapso.reduce((acc, turno) => {
      if (turno.especialista) {
        acc[turno.especialista] = (acc[turno.especialista] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(agrupados).map(([name, value]) => ({ name, value }));
  }

  descargarPDF(turnos: TurnosAgrupadosEspecialista[]) {
    const doc = new jsPDF();
    doc.addImage('assets/hospital-logo-icons8.png', 'PNG', 10, 10, 30, 30);
    doc.setFont('Courier');
    doc.setFontSize(50);
    doc.text('Clinica online', 45, 30);

    doc.setFontSize(30);
    doc.text('Turnos solicitados por medico', 10, 50);

    doc.setFontSize(18);
    doc.text(`Desde el: ${this.startDate}`, 10, 60);
    doc.text(`Hasta: ${this.endDate}`, 100, 60);

    let y = 80;
    turnos.forEach((turno) => {
      doc.text(`Especialista: ${turno.name} Turnos: ${turno.value}`, 10, y);
      y += 10;
    });

    doc.text(`Generado el: ${this.obtenerFechaActual()}`, 10, 170);
    doc.save(`Turnos_clinica.pdf`);
  }

  private obtenerFechaActual(): string {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  }
}
