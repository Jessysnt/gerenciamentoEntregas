import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entrega } from 'app/core/entregas/entregas.types';
import { EntregasService } from 'app/core/entregas/entregas.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TabelaEntregasComponent } from '../tabela-entregas/tabela-entregas.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalhes-entrega',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './detalhes-entrega.component.html',
  styleUrl: './detalhes-entrega.component.scss'
})
export class DetalhesEntregaComponent implements OnInit {


  entrega: Entrega;

  private _entregaService = inject(EntregasService);

  constructor(
    private _tabelaComponent: TabelaEntregasComponent,
  ) { }

  ngOnInit() {
    this._tabelaComponent.matDrawer.open();

    this._entregaService.entrega$.subscribe(entrega => {
      this.entrega = entrega;
    });
  }


  closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._tabelaComponent.matDrawer.close();
    }

}
