import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { EntregasService } from 'app/core/entregas/entregas.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatIconModule, MatTableModule, MatSortModule, NgClass, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private _entregaService = inject(EntregasService);

  motoristasData = [];
  motoristasDisplayedColumns = ['motorista', 'total_entregas', 'entregas_realizadas'];

  insucessoData = [];
  insucessoDisplayedColumns = ['motorista', 'insucesso'];

  bairroData = [];
  bairroDisplayedColumns = ['bairro', 'total_bairro', 'entregas_realizadas'];

  constructor(
      private _activatedRoute: ActivatedRoute,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
    ) { }

  ngOnInit() {
    this.getEntregas();
  }

  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  getEntregas(){
    this._entregaService.get().subscribe(res => {
      const entregas = Array.isArray(res) ? res : [res];
      this.processarDados(entregas);
    });
  }

  // Função para processar os dados e popular as tabelas
  processarDados(entregas: any[]): void {
    const motoristas = {};
    entregas.forEach(entrega => {
      const motoristaNome = entrega.motorista.nome;
      if (!motoristas[motoristaNome]) {
        motoristas[motoristaNome] = { motorista: motoristaNome, total_entregas: 0, entregas_realizadas: 0 };
      }
      motoristas[motoristaNome].total_entregas++;
      if (entrega.status_entrega === 'ENTREGUE') {
        motoristas[motoristaNome].entregas_realizadas++;
      }
    });
    this.motoristasData = Object.values(motoristas);

    const insucesso = {};
    entregas.forEach(entrega => {
      const motoristaNome = entrega.motorista.nome;
      if (entrega.status_entrega === 'INSUCESSO') {
        if (!insucesso[motoristaNome]) {
          insucesso[motoristaNome] = { motorista: motoristaNome, insucesso: 0 };
        }
        insucesso[motoristaNome].insucesso++;
      }
    });
    this.insucessoData = Object.values(insucesso);

    const bairros = {};
    entregas.forEach(entrega => {
      const bairroNome = entrega.cliente_destino.bairro;
      if (!bairros[bairroNome]) {
        bairros[bairroNome] = { bairro: bairroNome, total_bairro: 0, entregas_realizadas: 0 };
      }
      bairros[bairroNome].total_bairro++;
      if (entrega.status_entrega === 'ENTREGUE') {
        bairros[bairroNome].entregas_realizadas++;
      }
    });
    this.bairroData = Object.values(bairros);
  }

}
