import { Component, ElementRef, inject } from '@angular/core';
import { EspecialidadService } from '../../services/especialidad.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { EspecialidadInterfaceId } from '../../interfaces/especialidad';

@Component({
  selector: 'app-crear-especialidad',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './crear-especialidad.component.html',
  styleUrl: './crear-especialidad.component.css',
})
export class CrearEspecialidadComponent {
  especialidadService = inject(EspecialidadService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  fb = inject(FormBuilder);
  toastService = inject(ToastrService);

  selectedFile: File | null = null;
  listaEspecialidades: EspecialidadInterfaceId[] = [];

  ngOnInit() {
    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.listaEspecialidades = data;
    });
  }

  formEspecialidad = this.fb.nonNullable.group({
    nombreEspecialidad: ['', [Validators.required, Validators.minLength(6)]],
  });

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  capitalizarPrimeraLetra(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  agregarEspecialidad() {
    let especialidadAgregar = this.formEspecialidad
      .getRawValue()
      .nombreEspecialidad?.trim()
      .toLowerCase();

    if (especialidadAgregar) {
      const existeEspecialidad = this.listaEspecialidades.some(
        (especialidad) =>
          especialidad.nombre.trim().toLowerCase() === especialidadAgregar
      );

      if (existeEspecialidad) {
        this.toastService.error('La especialidad ya existe!');
      } else {
        especialidadAgregar = this.capitalizarPrimeraLetra(especialidadAgregar);

        this.especialidadService
          .createEspecialidad({ nombre: especialidadAgregar })
          .then(() => {
            this.toastService.success('Especialidad creada con éxito!');
            this.router.navigateByUrl('/registro-especialista');
          })
          .catch(() => {
            this.toastService.error('Error al crear especialidad!');
          });
      }
    }
  }

  onSubmitEspecialidad() {
    if (this.formEspecialidad.valid) {
      this.agregarEspecialidad();
    } else {
      this.toastService.error(
        'Por favor, rellene todos los campos correctamente.'
      );
    }
  }
}
