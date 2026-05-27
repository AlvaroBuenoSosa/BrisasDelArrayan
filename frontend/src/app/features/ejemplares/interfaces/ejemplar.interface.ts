export interface Ejemplar {

  id: number;

  name: string;

  titles: string;

  breed: string;

  color: string;

  sexo: 'Macho' | 'Hembra';

  description?: string;

  padreId?: number;

  madreId?: number;

  photo: string | string[];
}