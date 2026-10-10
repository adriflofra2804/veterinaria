export type EstadoCita = 'Pendiente' | 'Atendido' | 'Cancelado';

export interface Cita {
  id?: string;
  mascota: string;
  propietario: string;
  especie: string;
  fecha: string;
  costo: number;
  estado: EstadoCita;
  motivo: string;
}