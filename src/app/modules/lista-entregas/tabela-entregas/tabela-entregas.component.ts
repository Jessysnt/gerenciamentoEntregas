import { AsyncPipe, CommonModule, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { EntregasService } from 'app/core/entregas/entregas.service';
import { Entrega } from 'app/core/entregas/entregas.types';

@Component({
  selector: 'app-tabela-entregas',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, MatTableModule, MatPaginatorModule],
  templateUrl: './tabela-entregas.component.html',
  styleUrl: './tabela-entregas.component.scss'
})
export class TabelaEntregasComponent {
  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _entregaService = inject(EntregasService);

  displayedColumns: string[] = ['documento', 'cliente_origem', 'cliente_destino', 'motorista','status_entrega',  'action'];
  dataSource = new MatTableDataSource<Entrega>();
  drawerMode: 'side' | 'over';
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  statusControl = new FormControl('');
  motoristaControl = new FormControl('');

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.getEntregas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getEntregas(){
    this._entregaService.get().subscribe(res => {
      this.dataSource.data = Array.isArray(res) ? res : [res];
    });
  }

  /**
    * On backdrop clicked
    */
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  openSideNav( element): void {
   
  }

  filtrarEntregas() {
    const statusFilter = this.statusControl.value;
    const motoristaFilter = this.motoristaControl.value.toLowerCase();

    this.dataSource.filterPredicate = (data, filter) => {
      
      // Filtrando por motorista e status
      const matchesStatus = statusFilter ? data.status_entrega.trim().toLowerCase() === statusFilter.trim().toLowerCase() : true;
      const matchesMotorista = motoristaFilter ? data.motorista.nome.toLowerCase().includes(motoristaFilter.trim().toLowerCase()) : true;
      
      return matchesStatus && matchesMotorista;
    };

    // Aplica o filtro no MatTableDataSource
    this.dataSource.filter = `${statusFilter || ''} ${motoristaFilter || ''}`;
  }
}


