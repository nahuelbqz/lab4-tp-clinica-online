export interface PacienteInterfaceId extends PacienteInterface {
    id: string;
  }
  export interface PacienteInterface {
    nombre: string;
    apellido: string;
    edad: string;
    dni: string;
    obraSocial: string;
    mail: string;
    imagenUno: string;
    imagenDos: string;
    rol: string;
    // password: string;
  }