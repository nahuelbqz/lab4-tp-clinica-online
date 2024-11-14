import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bienvenida',
    loadComponent: () =>
      import('./pages/bienvenida/bienvenida.component').then(
        (m) => m.BienvenidaComponent
      ),
  },
  {
    path: 'bienvenido',
    redirectTo: 'bienvenida',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'bienvenida',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/pre-registro/pre-registro.component').then(
        (m) => m.PreRegistroComponent
      ),
  },
  {
    path: 'crear-especialidad',
    loadComponent: () =>
      import('./pages/crear-especialidad/crear-especialidad.component').then(
        (m) => m.CrearEspecialidadComponent
      ),
  },
  {
    path: 'registro-paciente',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'registro-especialista',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'registro-admin',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./pages/seccion-usuarios/seccion-usuarios.component').then(
        (m) => m.SeccionUsuariosComponent
      ),
  },
  {
    path: 'mis-turnos',
    loadComponent: () =>
      import('./pages/mis-turnos/mis-turnos.component').then(
        (m) => m.MisTurnosComponent
      ),
  },
  {
    path: 'turnos',
    loadComponent: () =>
      import('./pages/turnos/turnos.component').then((m) => m.TurnosComponent),
  },
  {
    path: 'solicitar-turno',
    loadComponent: () =>
      import('./pages/solicitar-turno/solicitar-turno.component').then(
        (m) => m.SolicitarTurnoComponent
      ),
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('./pages/mi-perfil/mi-perfil.component').then(
        (m) => m.MiPerfilComponent
      ),
  },
  {
    path: 'mis-horarios',
    loadComponent: () =>
      import('./pages/mis-horarios/mis-horarios.component').then(
        (m) => m.MisHorariosComponent
      ),
  },
  {
    path: 'historia-clinica',
    loadComponent: () =>
      import('./pages/historia-clinica/historia-clinica.component').then(
        (m) => m.HistoriaClinicaComponent
      ),
  },
  {
    path: 'cargar-historia-clinica',
    loadComponent: () =>
      import(
        './pages/cargar-historia-clinica/cargar-historia-clinica.component'
      ).then((m) => m.CargarHistoriaClinicaComponent),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./pages/error/error.component').then((m) => m.ErrorComponent),
  },
  {
    path: '',
    redirectTo: 'bienvenida',
    pathMatch: 'full',
  },

  //////////////////////
  {
    path: '**',
    loadComponent: () =>
      import('./pages/error/error.component').then((m) => m.ErrorComponent),
  },
];
