export interface Camada {
  id: number;

  nombre: string;

  fechaNacimiento: string;

  padreId: number;

  madreId: number;

  padreNombre?: string;

  madreNombre?: string;

  imagenPadre: string;

  imagenMadre: string;
}