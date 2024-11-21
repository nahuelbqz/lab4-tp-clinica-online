import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { EspecialistaInterfaceId } from '../../interfaces/especialista';
import { PacienteInterfaceId } from '../../interfaces/paciente';
import { TurnosService } from '../../services/turnos.service';
import { turnoInterfaceId } from '../../interfaces/turno';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { HoverTooltipDirective } from '../../directives/hover-tooltip.directive';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-seccion-usuarios',
  standalone: true,
  imports: [RouterLink, NgFor, HoverTooltipDirective],
  templateUrl: './seccion-usuarios.component.html',
  styleUrl: './seccion-usuarios.component.css',
})
export class SeccionUsuariosComponent {
  authService = inject(AuthService);
  turnosService = inject(TurnosService);
  toastService = inject(ToastrService);
  usuarios: any[] = [];
  listaEspecialistas: EspecialistaInterfaceId[] = [];
  listaPacientes: PacienteInterfaceId[] = [];
  listaTurnos: turnoInterfaceId[] = [];

  ngOnInit() {
    this.authService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.listaEspecialistas = data.filter(
        (usuario) => usuario.rol === 'especialista'
      );
      this.listaPacientes = data.filter(
        (usuario) => usuario.rol === 'paciente'
      );
    });

    this.turnosService.getTurnos().subscribe((data) => {
      this.listaTurnos = data;
    });
  }

  validarEspecialista(especialista: any) {
    let estaValidadoAux: boolean;
    if (especialista.estaValidado) {
      estaValidadoAux = false;
    } else {
      estaValidadoAux = true;
    }
    const auxEspecialista = {
      nombre: especialista.nombre,
      apellido: especialista.apellido,
      edad: especialista.edad,
      dni: especialista.dni,
      especialidad: especialista.especialidad,
      mail: especialista.mail,
      imagenUno: especialista.imagenUno,
      rol: especialista.rol,
      estaValidado: estaValidadoAux,
      deSemana: especialista.deSemana,
      hastaSemana: especialista.hastaSemana,
      deSabado: especialista.deSabado,
      hastaSabado: especialista.hastaSabado,
      usuariosAtentidos: especialista.usuariosAtentidos,
    };
    this.authService.updateUsuarioEspecialista(
      especialista.id,
      auxEspecialista
    );
  }

  //Excel
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  descargarExcel() {
    const usuariosFormateados = this.usuarios.map((usuario) => {
      return {
        Nombre: usuario.nombre,
        Apellido: usuario.apellido,
        Edad: usuario.edad,
        DNI: usuario.dni,
        Correo: usuario.mail,
        Rol: usuario.rol,
        Especialidades: usuario.especialidad
          ? usuario.especialidad.join(', ')
          : 'No especificadas', // array a cadena
        Validado: usuario.estaValidado ? 'Sí' : 'No',
      };
    });

    this.exportAsExcelFile(usuariosFormateados, 'listadoUsuarios');
    this.toastService.success('Listado de Usuarios descargado', 'Usuarios');
  }

  descargarTurnosPaciente(usuario: PacienteInterfaceId) {
    const listaTurnosUsuario: any[] = [];
    if (usuario.rol === 'paciente') {
      this.listaTurnos.forEach((t: turnoInterfaceId) => {
        if (usuario.mail === t.paciente) {
          const turno = {
            nombrePaciente: usuario.nombre,
            apellidoPaciente: usuario.apellido,
            fecha: t.date,
            hora: t.time,
            especialidades: t.especialidad,
            mailEspecialista: t.especialista,
            estado: t.estado,
          };
          listaTurnosUsuario.push(turno);
        }
      });

      if (listaTurnosUsuario.length === 0) {
        this.toastService.warning('El PACIENTE no tiene turnos', 'Usuarios');
      } else {
        this.exportAsExcelFile(listaTurnosUsuario, 'turnosPaciente');
        this.toastService.success(
          'Turnos del PACIENTE descargados',
          'Usuarios'
        );
      }
    } else {
      this.toastService.warning('Debes elegir un PACIENTE', 'Usuarios');
    }
  }
}
