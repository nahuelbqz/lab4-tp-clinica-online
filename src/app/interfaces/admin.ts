export interface AdminInterfaceId extends AdminInterface {
  id: string;
}
export interface AdminInterface {
  nombre: string;
  apellido: string;
  edad: string;
  dni: string;
  mail: string;
  imagenUno: string;
  rol: string;
  // password: string;
}
