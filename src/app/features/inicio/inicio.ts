import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitaApi } from '../../services/cita-api';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  citas = signal<Cita[]>([]);
  error = signal(false);

  total = computed(() => this.citas().length);
  pendientes = computed(() => this.citas().filter(c => c.estado === 'Pendiente').length);
  atendidas = computed(() => this.citas().filter(c => c.estado === 'Atendido').length);
  canceladas = computed(() => this.citas().filter(c => c.estado === 'Cancelado').length);
  ingresos = computed(() =>
    this.citas()
      .filter(c => c.estado === 'Atendido')
      .reduce((suma, c) => suma + c.costo, 0)
  );

  constructor(private api: CitaApi) {}

  ngOnInit(): void {
    this.api.obtenerCitas().subscribe({
      next: datos => this.citas.set(datos),
      error: () => this.error.set(true)
    });
  }
}