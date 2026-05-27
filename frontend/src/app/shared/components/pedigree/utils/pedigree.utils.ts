import { PedigreeMember } from '../interfaces/pedigree.interface';

export function getPrimaryPhoto(photo: string | string[]): string {
  if (!photo) return '';

  if (Array.isArray(photo)) {
    return photo[0] || '';
  }

  return photo;
}

export function getPedigreeMemberById(
  pedigree: PedigreeMember[],
  id: number | null
): PedigreeMember | null {

  if (!id) return null;

  return pedigree.find(member => member.id === id) || null;
}

export function getParents(
  pedigree: PedigreeMember[],
  member: PedigreeMember | null
): (PedigreeMember | null)[] {

  if (!member) {
    return [null, null];
  }

  return [
    getPedigreeMemberById(pedigree, member.padreId),
    getPedigreeMemberById(pedigree, member.madreId)
  ];
}

export function countRepeatedNames(
  pedigree: PedigreeMember[]
): Record<string, number> {

  return pedigree.reduce((acc, member) => {

    if (!member.name) return acc;

    acc[member.name] = (acc[member.name] || 0) + 1;

    return acc;

  }, {} as Record<string, number>);
}