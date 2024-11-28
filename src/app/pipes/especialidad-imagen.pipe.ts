import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'especialidadImagen',
  standalone: true,
})
export class EspecialidadImagenPipe implements PipeTransform {
  transform(especialidad: string): string {
    const especialidadImagenMap: Record<string, string> = {
      Cardiología: '/assets/especialidades/cardiologia.png',
      Dermatología: '/assets/especialidades/dermatologia.png',
      Pediatría: '/assets/especialidades/pediatria.png',
      Neurología: '/assets/especialidades/neurologia.png',
    };

    // Retorna la imagen asociada o una imagen predeterminada si no hay coincidencia
    return especialidadImagenMap[especialidad] || '/assets/especialista.png';
  }
}
