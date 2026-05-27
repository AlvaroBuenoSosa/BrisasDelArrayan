export interface Cachorro {

  id: number;

  nombre: string;

  raza: string;

  color: string;

  sexo: 'Macho' | 'Hembra';

  fechaNacimiento: string;

  camadaId: number;

  padreId: number;

  madreId: number;

  padreNombre?: string;

  madreNombre?: string;

  photo: string | string[];
}