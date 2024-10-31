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
  // password: string;
}
