import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { CitaApi } from '../../services/cita-api';
import { Cita, EstadoCita } from '../../models/cita.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, UpperCasePipe],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {
  citas = signal<Cita[]>([]);
  cargando = signal(true);
  error = signal('');

  constructor(private api: CitaApi) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando.set(true);
    this.api.obtenerCitas().subscribe({
      next: datos => {
        this.citas.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con la API. Ejecuta: npm run api');
        this.cargando.set(false);
      }
    });
  }

  cambiarEstado(cita: Cita, estado: EstadoCita): void {
    if (cita.id === undefined) {
      return;
    }
    this.api.cambiarEstado(cita.id, estado).subscribe({
      next: actualizada => {
        this.citas.update(lista => lista.map(c => (c.id === actualizada.id ? actualizada : c)));
      },
      error: () => this.error.set('No se pudo actualizar el estado de la cita.')
    });
  }

  eliminar(cita: Cita): void {
    if (cita.id === undefined) {
      return;
    }
    if (!confirm(`¿Eliminar la cita de ${cita.mascota}?`)) {
      return;
    }
    this.api.eliminarCita(cita.id).subscribe({
      next: () => {
        this.citas.update(lista => lista.filter(c => c.id !== cita.id));
      },
      error: () => this.error.set('No se pudo eliminar la cita.')
    });
  }
}