export interface EspecialistaInterfaceId extends EspecialistaInterface {
  id: string;
}
export interface EspecialistaInterface {
  nombre: string;
  apellido: string;
  edad: string;
  dni: string;
  especialidad: string;
  mail: string;
  imagenUno: string;
  rol: string;
  estaValidado: boolean;
  deSemana: number;
  hastaSemana: number;
  deSabado: number;
  hastaSabado: number;
  usuariosAtentidos: string[];
}
