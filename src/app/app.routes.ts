import { Routes } from '@angular/router';
import { Inicio } from './features/inicio/inicio';
import { Citas } from './features/citas/citas';
import { NuevaCita } from './features/nueva-cita/nueva-cita';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'citas', component: Citas },
  { path: 'nueva-cita', component: NuevaCita },
  { path: '**', redirectTo: '' }
];