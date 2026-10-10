import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaApi } from '../../services/cita-api';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-nueva-cita',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nueva-cita.html',
  styleUrl: './nueva-cita.css'
})
export class NuevaCita {
  especies = ['Perro', 'Gato', 'Ave', 'Conejo', 'Otro'];
  guardando = signal(false);
  error = signal('');

  cita: Cita = {
    mascota: '',
    propietario: '',
    especie: '',
    fecha: '',
    costo: 0,
    estado: 'Pendiente',
    motivo: ''
  };

  constructor(
    private api: CitaApi,
    private router: Router
  ) {}

  guardar(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.guardando.set(true);
    this.error.set('');

    this.api.crearCita(this.cita).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/citas']);
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar la cita. Verifica que la API esté activa.');
      }
    });
  }
}