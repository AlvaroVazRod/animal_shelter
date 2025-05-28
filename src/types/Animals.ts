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
  image: string; 
  species: string;
  breed: string;
  gender: string;
  maxDonations: number;
  collected: number;
  status: string;
  priority: 'low' | 'medium' | 'high';
  type?: string;
  vaccines?: string[];
  surgery?: boolean;
  specialNeeds?: boolean;
  images?: AnimalImage[];
  tags?: AnimalTag[];
}
export interface AnimalImage {
  id: number;
  filename: string;
  fechaSubida?: string;
  animalId?: number;
}

interface AnimalTag{
  id: number;
  name: string;
  description: string;
  color: string;
  url: string;
}