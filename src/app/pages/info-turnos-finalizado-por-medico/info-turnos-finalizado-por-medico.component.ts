import { Component, inject } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import jsPDF from 'jspdf';
import { turnoInterface } from '../../interfaces/turno';
import { TurnosService } from '../../services/turnos.service';
import { FormsModule } from '@angular/forms';

interface TurnosAgrupadosEspecialista {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-info-turnos-finalizado-por-medico',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './info-turnos-finalizado-por-medico.component.html',
  styleUrl: './info-turnos-finalizado-por-medico.component.css',
})
export class InfoTurnosFinalizadoPorMedicoComponent {
  turnosService = inject(TurnosService);

  single: any[] = [];
  view: [number, number] = [700, 400];
  showLegend: boolean = true;
  gradient: boolean = false;
  colorScheme: string = 'horizon';

  legenTitle = 'Especialistas';
  startDate: string = '1/1/2024';
  endDate: string = '30/12/2025';

  turnosAux: any[] = [];

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.turnosAux = data;
      this.single = this.agruparTurnosRealizadosPorEspecialista(
        data,
        this.startDate,
        this.endDate
      );
    });
  }

  parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  clickBuscar() {
    this.single = this.agruparTurnosRealizadosPorEspecialista(
      this.turnosAux,
      this.startDate,
      this.endDate
    );
  }

  agruparTurnosRealizadosPorEspecialista = (
    turnos: turnoInterface[],
    startDate: string,
    endDate: string
  ): TurnosAgrupadosEspecialista[] => {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    const turnosRealizadosEnLapso = turnos.filter((turno) => {
      const turnoDate = this.parseDate(turno.date);
      return (
        turnoDate >= start && turnoDate <= end && turno.estado === 'realizado'
      );
    });

    const agrupados = turnosRealizadosEnLapso.reduce((acc, turno) => {
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
  };

  descargarPDF(turnos: TurnosAgrupadosEspecialista[]) {
    const doc = new jsPDF();
    doc.addImage('assets/hospital-logo-icons8.png', 'PNG', 10, 10, 30, 30);
    doc.setFont('Courier');
    doc.setFontSize(50);
    doc.text('Clinica online', 45, 30);

    doc.setFontSize(30);
    doc.text('Turnos finalizados por medico', 10, 50);

    doc.setFontSize(18);
    doc.text(`Desde el: ${this.startDate}`, 10, 60);
    doc.text(`Hasta: ${this.endDate}`, 90, 60);

    let y = 80;
    turnos.forEach((turno) => {
      doc.text(`Especialista: ${turno.name} Turnos: ${turno.value}`, 10, y);
      y += 10;
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
