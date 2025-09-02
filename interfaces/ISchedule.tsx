export interface ScheduleConfig {
  startTime: string; // "07:00"
  endTime: string;   // "22:00"
}

export interface ScheduleContextProps {
  config: ScheduleConfig | null;
  setConfig: (start: string, end: string) => void;
}
