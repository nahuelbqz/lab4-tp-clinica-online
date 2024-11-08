import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EspecialistaInterface } from '../../interfaces/especialista';
import { AuthService } from '../../services/auth.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-mis-horarios',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor],
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.css'],
})
export class MisHorariosComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastAlert = inject(ToastrService);

  // Arrays de horas
  weekHours = Array.from({ length: 12 }, (_, i) => 8 + i); // Horas de 8 a 19 para semana
  saturdayHours = Array.from({ length: 7 }, (_, i) => 8 + i); // Horas de 8 a 14 para sábado

  form = this.fb.nonNullable.group({
    deSemana: ['8', Validators.required],
    hastaSemana: ['19', Validators.required],
    deSabado: ['8', Validators.required],
    hastaSabado: ['14', Validators.required],
  });

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.authService
        .getUsuarioId(this.authService.currentUserSig()?.email)
        .then((r) => {
          let data: EspecialistaInterface = {
            nombre: r.nombre,
            apellido: r.apellido,
            edad: r.edad,
            dni: r.dni,
            especialidad: r.especialidad,
            mail: r.mail,
            imagenUno: r.imagenUno,
            estaValidado: r.estaValidado,
            rol: r.rol,
            deSemana: parseInt(value.deSemana),
            hastaSemana: parseInt(value.hastaSemana),
            deSabado: parseInt(value.deSabado),
            hastaSabado: parseInt(value.hastaSabado),
            usuariosAtentidos: r.usuariosAtentidos,
          };
          this.authService
            .updateUsuarioEspecialista(r.id, data)
            .then(() => {
              this.toastAlert.success('Se modifico correctamente');
            })
            .catch(() => {
              this.toastAlert.error('No se pudo modificar', 'Error');
            });
        });
    } else {
      this.toastAlert.error('Datos incorrectos', 'Error');
    }
  }
}
