import { Component, inject } from '@angular/core';
import { LogInterfaceId } from '../../interfaces/log';
import jsPDF from 'jspdf';
import { LogService } from '../../services/log.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-info-logs',
  standalone: true,
  imports: [NgFor],
  templateUrl: './info-logs.component.html',
  styleUrl: './info-logs.component.css',
})
export class InfoLogsComponent {
  logs: LogInterfaceId[] = [];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.cargarLogs();
  }

  cargarLogs(): void {
    this.logService.traerLogs().subscribe((data) => {
      this.logs = data;
    });
  }

  descargarPDF(logs: LogInterfaceId[]) {
    const doc = new jsPDF();

    doc.addImage('assets/hospital-logo-icons8.png', 'PNG', 10, 10, 30, 30);
    doc.setFont('Courier');
    doc.setFontSize(50);
    doc.text('Clinica online', 45, 30);

    doc.setFontSize(30);
    doc.text('Listado de logs', 10, 52);

    // Contenido
    let y = 60;
    doc.setFontSize(12);
    doc.text('Email', 10, y);
    doc.text('Fecha', 90, y);
    doc.text('Hora', 150, y);

    doc.line(10, y + 2, 200, y + 2); // Línea separadora

    y += 10;

    logs.forEach((log) => {
      if (y > 280) {
        // Si la página está llena, agrega una nueva
        doc.addPage();
        y = 10;
      }
      doc.text(log.email, 10, y);
      doc.text(log.date, 90, y);
      doc.text(log.time, 150, y);
      y += 10;
    });

    doc.setFontSize(10);
    doc.text(`Generado el: ${this.obtenerFechaActual()}`, 10, 290);
    doc.save('Listado_Logs.pdf');
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const anio = hoy.getFullYear();
    const horas = hoy.getHours().toString().padStart(2, '0');
    const minutos = hoy.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
}
