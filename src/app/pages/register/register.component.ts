import { Component, ElementRef, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialidadInterfaceId } from '../../interfaces/especialidad';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  elementRef = inject(ElementRef);
  fb = inject(FormBuilder);
  toastAlert = inject(ToastrService);
  especialidadService = inject(EspecialidadService);

  arrayEspecialidades?: EspecialidadInterfaceId[];

  opcionAlta?: string;

  selectedFile1: File | null = null;
  selectedFile2: File | null = null;
  selectedFile3: File | null = null;
  selectedFile4: File | null = null;

  ngOnInit(): void {
    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.arrayEspecialidades = data;
    });
    this.obtenerRutaActual();

    console.log('Usuario actual: ' + this.authService.currentUserSig()?.email);
  }

  obtenerRutaActual(): void {
    if (this.router.url == '/registro-paciente') {
      this.opcionAlta = 'paciente';
    } else if (this.router.url == '/registro-especialista') {
      this.opcionAlta = 'especialista';
    } else if (this.router.url == '/registro-admin') {
      this.opcionAlta = 'admin';
    }
  }

  onFileSelected1(event: any) {
    this.selectedFile1 = event.target.files[0];
  }
  onFileSelected2(event: any) {
    this.selectedFile2 = event.target.files[0];
  }
  onFileSelected3(event: any) {
    this.selectedFile3 = event.target.files[0];
  }
  onFileSelected4(event: any) {
    this.selectedFile4 = event.target.files[0];
  }

  //PACIENTE
  formPaciente = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
    dni: ['', [Validators.required, Validators.maxLength(8)]],
    obraSocial: ['', Validators.required],
    mail: ['', Validators.required],
    foto1: ['', Validators.required],
    foto2: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onSubmitPaciente() {
    if (this.formPaciente.valid && this.selectedFile1 && this.selectedFile2) {
      const value = this.formPaciente.getRawValue();
      this.authService
        .register(value.mail, value.password)
        .then(async () => {
          if (this.selectedFile1 && this.selectedFile2) {
            if (this.authService.currentUserSig()?.rol == 'admin') {
              this.authService.login(
                this.authService.mailActual,
                this.authService.passActual
              );
            }

            let respuesta = await this.authService.createUsuarioPaciente(
              value,
              this.selectedFile1,
              this.selectedFile2
            );

            if (respuesta) {
              this.router.navigateByUrl('/login');
              this.toastAlert.success('Registro exitoso!');
            } else {
              this.toastAlert.error('Error al crear el usuario!', 'Error');
            }
          }
        })
        .catch((error) => {
          console.error('Error durante el registro:', error);
          this.toastAlert.error('Error al registrar', 'Error');
        });
    }
  }

  //ESPECIALISTA
  formEspecialista = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
    dni: ['', [Validators.required, Validators.minLength(2)]],
    especialidades: this.fb.array([this.createEspecialidad()]),
    mail: ['', Validators.required],
    foto3: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get especialidades(): FormArray {
    return this.formEspecialista.get('especialidades') as FormArray;
  }

  createEspecialidad(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
    });
  }

  addEspecialidad() {
    this.especialidades.push(this.createEspecialidad());
  }

  removeEspecialidad(index: number) {
    this.especialidades.removeAt(index);
  }

  async onSubmitEspecialista() {
    if (this.formEspecialista.valid && this.selectedFile3) {
      const value = this.formEspecialista.getRawValue();
      const especialidades = value.especialidades.map((e: any) => e.nombre); // Mantener como array

      this.authService
        .register(value.mail, value.password)
        .then(async () => {
          if (this.selectedFile3) {
            if (this.authService.currentUserSig()?.rol == 'admin') {
              this.authService.login(
                this.authService.mailActual,
                this.authService.passActual
              );
            }

            let respuesta = await this.authService.createUsuarioEspecialista(
              value,
              this.selectedFile3,
              especialidades
            );

            if (respuesta) {
              this.router.navigateByUrl('/login');
              this.toastAlert.success('Registro exitoso!');
            } else {
              this.toastAlert.error('Error al crear el usuario!', 'Error');
            }
          }
        })
        .catch(() => {
          this.toastAlert.error('Error al registrar', 'Error');
        });
    }
  }

  //ADMIN
  formAdmin = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    edad: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
    dni: ['', [Validators.required, Validators.maxLength(8)]],
    mail: ['', Validators.required],
    foto1: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  
  async onSubmitAdmin() {
    if (this.formAdmin.valid && this.selectedFile4) {
      const value = this.formAdmin.getRawValue();
      this.authService
        .register(value.mail, value.password)
        .then(async () => {
          if (this.selectedFile4) {
            //re log
            this.authService.login(
              this.authService.mailActual,
              this.authService.passActual
            );
            let respuesta = await this.authService.createUsuarioAdmin(
              value,
              this.selectedFile4
            );
            if (respuesta) {
              this.router.navigateByUrl('/login');
              this.toastAlert.success('Registro exitoso!');
            } else {
              this.toastAlert.error('Error al crear el usuario!', 'Error');
            }
          }
        })
        .catch(() => {
          this.toastAlert.error('Error al registrar', 'Error');
        });
    }
  }
}
