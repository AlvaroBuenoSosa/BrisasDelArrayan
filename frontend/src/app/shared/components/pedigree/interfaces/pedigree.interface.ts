export interface PedigreeMember {
  id: number;
  name: string;
  photo: string | string[];
  url?: string;
  titles?: string;
  color?: string;
  breed?: string;
  padreId: number | null;
  madreId: number | null;
}

export interface PedigreeResponse {
  ejemplar: PedigreeMember;
  pedigree: PedigreeMember[];
}