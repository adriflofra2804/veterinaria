import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cita, EstadoCita } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaApi {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = '/api/citas';

    obtenerCitas(): Observable<Cita[]> {
        return this.http.get<Cita[]>(this.apiUrl);
    }

    crearCita(cita: Cita): Observable<Cita> {
        return this.http.post<Cita>(this.apiUrl, cita);
    }

    cambiarEstado(id: string, estado: EstadoCita): Observable<Cita> {
        return this.http.patch<Cita>(`${this.apiUrl}/${id}`, { estado });
    }

    eliminarCita(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}