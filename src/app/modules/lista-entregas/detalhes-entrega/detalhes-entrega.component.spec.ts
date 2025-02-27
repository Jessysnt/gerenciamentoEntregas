import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DetalhesEntregaComponent } from './detalhes-entrega.component';
import { EntregasService } from 'app/core/entregas/entregas.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { TabelaEntregasComponent } from '../tabela-entregas/tabela-entregas.component';
import { Entrega } from 'app/core/entregas/entregas.types';
import { BehaviorSubject, of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';


describe('DetalhesEntregaComponent', () => {
  let component: DetalhesEntregaComponent;
  let fixture: ComponentFixture<DetalhesEntregaComponent>;
  let entregasServiceSpy: jasmine.SpyObj<EntregasService>;
  let mockDrawer: jasmine.SpyObj<MatDrawer>;

  const mockEntrega: Entrega = {
    id: '1',
    documento: 'DOC123',
    status_entrega: 'PENDENTE',
    motorista: { nome: 'João Silva' },
    cliente_origem: { nome: 'Cliente A', endereco: '', cidade: '', bairro: '' },
    cliente_destino: { nome: 'Cliente B', endereco: '', cidade: '', bairro: '' }
  };

  beforeEach(async () => {
    // Criar mocks
    mockDrawer = jasmine.createSpyObj('MatDrawer', ['open', 'close']);
    const mockTabelaComponent = { matDrawer: mockDrawer };

    entregasServiceSpy = jasmine.createSpyObj('EntregasService', [], {
      entrega$: new BehaviorSubject<Entrega>(mockEntrega)
    });

    await TestBed.configureTestingModule({
      imports: [
        DetalhesEntregaComponent,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: TabelaEntregasComponent, useValue: mockTabelaComponent },
        { provide: EntregasService, useValue: entregasServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve abrir o drawer e carregar a entrega na inicialização', fakeAsync(() => {
    // Verificar se o drawer foi aberto
    expect(mockDrawer.open).toHaveBeenCalled();

    // Verificar se a entrega foi carregada
    component.entrega = mockEntrega;
    fixture.detectChanges();
    tick();

    expect(component.entrega).toEqual(mockEntrega);
  }));

  it('deve fechar o drawer ao chamar closeDrawer', async () => {
    mockDrawer.close.and.returnValue(Promise.resolve('close'));

    const result = await component.closeDrawer();

    expect(result).toBe('close');
    expect(mockDrawer.close).toHaveBeenCalled();
  });

  it('deve atualizar a entrega quando o serviço emite novo valor', fakeAsync(() => {
    const newEntrega = {
      ...mockEntrega,
      documento: 'DOC456',
      status_entrega: 'ENTREGUE'
    };

    (entregasServiceSpy.entrega$ as BehaviorSubject<Entrega>).next(newEntrega);
    tick();
    fixture.detectChanges();

    expect(component.entrega.documento).toBe('DOC456');
    expect(component.entrega.status_entrega).toBe('ENTREGUE');
  }));
});