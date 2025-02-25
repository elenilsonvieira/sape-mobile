export default interface IPlace {
    id: string;
    name: string;
    reference?: string;
    maximumCapacityParticipants?: number;
    isPublic: boolean;
  }