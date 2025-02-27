import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { EntregasService } from 'app/core/entregas/entregas.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Entrega } from 'app/core/entregas/entregas.types';

describe('DashboardComponent', () => {
  let componente: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let entregasServiceSpy: jasmine.SpyObj<EntregasService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(waitForAsync(() => {
    // Criando um espião para o serviço de entregas
    entregasServiceSpy = jasmine.createSpyObj('EntregasService', ['get']);
    
    // Criando espiões para Router e ActivatedRoute
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: {} });

    TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        MatProgressBarModule
      ],
      providers: [
        { provide: EntregasService, useValue: entregasServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    componente = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(componente).toBeTruthy();
  });

  it('deve chamar getEntregas ao inicializar', () => {
    const mockEntregas : Entrega[] =[
      {
        documento: '123',
        motorista: { nome: 'Carlos' },
        status_entrega: 'ENTREGUE',
        cliente_destino: {
          bairro: 'Centro',
          nome: '',
          endereco: '',
          cidade: ''
        },
        id: '',
        cliente_origem: undefined
      },
      {
        documento: '456',
        motorista: { nome: 'Ana' },
        status_entrega: 'INSUCESSO',
        cliente_destino: {
          bairro: 'Jardins',
          nome: '',
          endereco: '',
          cidade: ''
        },
        id: '',
        cliente_origem: undefined
      }
    ];

    entregasServiceSpy.get.and.returnValue(of(mockEntregas));

    componente.ngOnInit();

    expect(entregasServiceSpy.get).toHaveBeenCalled();
    expect(componente.motoristasData.length).toBe(2);
    expect(componente.insucessoData.length).toBe(1);
    expect(componente.bairroData.length).toBe(2);
  });

  it('deve navegar de volta ao clicar no backdrop', () => {
    componente.onBackdropClicked();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['./'], { relativeTo: activatedRouteSpy });
  });

});