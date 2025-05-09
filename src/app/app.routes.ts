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
    path: 'pacientes',
    loadComponent: () =>
      import('./pages/pacientes/pacientes.component').then(
        (m) => m.PacientesComponent
      ),
  },
  {
    path: 'informes',
    loadComponent: () =>
      import('./pages/informes/informes.component').then(
        (m) => m.InformesComponent
      ),
  },
  {
    path: 'informes-logs',
    loadComponent: () =>
      import('./pages/info-logs/info-logs.component').then(
        (m) => m.InfoLogsComponent
      ),
  },
  {
    path: 'informes-turnos-por-especialidad',
    loadComponent: () =>
      import(
        './pages/info-turno-por-especialidad/info-turno-por-especialidad.component'
      ).then((m) => m.InfoTurnoPorEspecialidadComponent),
  },
  {
    path: 'informes-turnos-por-dia',
    loadComponent: () =>
      import('./pages/info-turno-por-dia/info-turno-por-dia.component').then(
        (m) => m.InfoTurnoPorDiaComponent
      ),
  },
  {
    path: 'informes-turnos-solicitados-por-medico',
    loadComponent: () =>
      import(
        './pages/info-turnos-solicitados-por-medico/info-turnos-solicitados-por-medico.component'
      ).then((m) => m.InfoTurnosSolicitadosPorMedicoComponent),
  },
  {
    path: 'informes-turnos-finalizados-por-medico',
    loadComponent: () =>
      import(
        './pages/info-turnos-finalizado-por-medico/info-turnos-finalizado-por-medico.component'
      ).then((m) => m.InfoTurnosFinalizadoPorMedicoComponent),
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
