import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-lista-entregas',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './lista-entregas.component.html',
  styleUrl: './lista-entregas.component.scss'
})
export class ListaEntregasComponent {

}
