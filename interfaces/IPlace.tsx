export default interface IPlace {
  id?: number;
  name: string;
  reference?: string;
  maximumCapacityParticipants: number;
  isPublic: boolean;
  responsibles?: any[]; // pode ser User[] se você tiver a interface User
}
