export interface Animal {
  id: number;
  name: string;
  imageUrl?: string; // por implementar
  description: string;
  weight: number;
  height: number;
  length: number;
  age: number;
  color: string;
  image: string | null; 
  species: string;
  breed: string;
  gender: string;
  collected: number;
  status: string;
  type?: string;
  sponsorPrice: number;
  adoptionPrice: number;
  images?: AnimalImage[];
  tags?: AnimalTag[];
  arrivalDate: string;
}
export interface AnimalImage {
  id: number;
  filename: string;
  fechaSubida?: string;
  animalId?: number;
}

export interface AnimalTag{
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string | null;
}