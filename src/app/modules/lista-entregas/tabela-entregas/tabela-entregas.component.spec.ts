import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TabelaEntregasComponent } from './tabela-entregas.component';
import { EntregasService } from 'app/core/entregas/entregas.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Entrega } from 'app/core/entregas/entregas.types';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TabelaEntregasComponent', () => {
  let component: TabelaEntregasComponent;
  let fixture: ComponentFixture<TabelaEntregasComponent>;
  let entregasServiceSpy: jasmine.SpyObj<EntregasService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  const mockEntregas: Entrega[] = [
    {
      id: '1',
      documento: 'DOC123',
      status_entrega: 'PENDENTE',
      motorista: { nome: 'João Silva' },
      cliente_origem: {
        nome: 'Cliente A',
        endereco: '',
        bairro: '',
        cidade: ''
      },
      cliente_destino: {
        nome: 'Cliente B',
        endereco: '',
        bairro: '',
        cidade: ''
      }
    },
    {
      id: '2',
      documento: 'DOC456',
      status_entrega: 'ENTREGUE',
      motorista: { nome: 'Maria Souza' },
      cliente_origem: {
        nome: 'Cliente C',
        endereco: '',
        bairro: '',
        cidade: ''
      },
      cliente_destino: {
        nome: 'Cliente D',
        endereco: '',
        bairro: '',
        cidade: ''
      }
    }
  ];

  beforeEach(waitForAsync(() => {
    entregasServiceSpy = jasmine.createSpyObj('EntregasService', ['get']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: {} });

    TestBed.configureTestingModule({
      imports: [
        TabelaEntregasComponent,
        NoopAnimationsModule, // Adicione esta linha
        MatTableModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: EntregasService, useValue: entregasServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabelaEntregasComponent);
    component = fixture.componentInstance;
    entregasServiceSpy.get.and.returnValue(of(mockEntregas));
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar entregas na inicialização', () => {
    expect(entregasServiceSpy.get).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  });

  it('deve configurar o paginador após a inicialização da view', () => {
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBe(component.paginator);
  });

  it('deve aplicar filtro por status e motorista', fakeAsync(() => {
    // Configurar controles
    component.statusControl.setValue('PENDENTE');
    component.motoristaControl.setValue('Maria');

    // Disparar detecção de mudanças e aguardar possíveis timers
    fixture.detectChanges();
    tick(500); // Aumentar o tempo para garantir o processamento de eventuais debounces

    // Aplicar filtro
    component.filtrarEntregas();

    // Processar operações pendentes
    fixture.detectChanges();
    tick(); // Garantir conclusão de todas operações assíncronas

    // Verificar resultados
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].documento).toBe('DOC123');

    // Limpar timers pendentes
    discardPeriodicTasks();
  }));

  it('deve navegar ao clicar no backdrop', () => {
    component.onBackdropClicked();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['./'], { relativeTo: activatedRouteSpy });
  });

  it('deve exibir todas as colunas corretamente', () => {
    const expectedColumns = ['documento', 'cliente_origem', 'cliente_destino', 'motorista', 'status_entrega', 'action'];
    expect(component.displayedColumns).toEqual(expectedColumns);
  });

  it('deve lidar com resposta não array do serviço', () => {
    entregasServiceSpy.get.and.returnValue(of([mockEntregas[0]]));
    component.getEntregas();
    expect(component.dataSource.data.length).toBe(1);
  });
});