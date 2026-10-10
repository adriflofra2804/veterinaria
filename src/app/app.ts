import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  menuAbierto = signal(false);

  alternarMenu(): void {
    this.menuAbierto.update(valor => !valor);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}