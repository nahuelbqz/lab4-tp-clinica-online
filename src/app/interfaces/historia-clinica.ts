export interface HistoriaClinicaInterfaceId extends HistoriaClinicaInterface {
  id: string;
}
export interface HistoriaClinicaInterface {
  altura: number;
  peso: number;
  temperatura: number | undefined;
  presion: number | undefined;
  arrayObservaciones: string[];
  mailPaciente: string | undefined;
  mailEspecialistas: string;
  idTurno: string;
  especialidad: string;
}
