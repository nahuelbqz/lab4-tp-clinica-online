import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { HistoriaClinicaService } from '../../services/historia-clinica.service';
import { HistoriaClinicaInterface } from '../../interfaces/historia-clinica';

@Component({
  selector: 'app-cargar-historia-clinica',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './cargar-historia-clinica.component.html',
  styleUrl: './cargar-historia-clinica.component.css',
})
export class CargarHistoriaClinicaComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  historialService = inject(HistoriaClinicaService);
  router = inject(Router);
  toastAlert = inject(ToastrService);

  form = this.fb.nonNullable.group({
    altura: [0, [Validators.required, Validators.min(1)]],
    peso: [0, [Validators.required, Validators.min(1)]],
    temperatura: [0, [Validators.required, Validators.min(1)]],
    presion: [0, [Validators.required, Validators.min(1)]],
    clave1: [''],
    valor1: [''],
    clave2: [''],
    valor2: [''],
    clave3: [''],
    valor3: [''],
  });

  async onSubmit() {
    if (this.form.valid) {
      let value = this.form.getRawValue();
      const historialAux: HistoriaClinicaInterface = {
        altura: value.altura,
        peso: value.peso,
        temperatura: value.temperatura,
        presion: value.presion,
        arrayObservaciones: [
          value.clave1,
          value.valor1,
          value.clave2,
          value.valor2,
          value.clave3,
          value.valor3,
        ],
        mailPaciente: this.historialService.mailPaciente,
        mailEspecialistas: this.historialService.mailEspecialista,
        idTurno: this.historialService.idTurno,
        especialidad: this.historialService.especialidadEspecialista,
      };
      this.historialService.saveHistoriaClinica(historialAux).then(() => {
        this.toastAlert.success(
          'Se creo el historial clinico Correctamente',
          'Exito'
        );
      });

      this.form.reset();
      this.router.navigateByUrl('/mis-turnos');
    }
  }

  get isFormValid() {
    const { altura, peso, temperatura, presion } = this.form.controls;
    return altura.valid && peso.valid && temperatura.valid && presion.valid;
  }
}
