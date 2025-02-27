export interface Entrega {
    id: string
    documento: string
    motorista: Motorista
    cliente_origem: ClienteOrigem
    cliente_destino: ClienteDestino
    status_entrega: string
  }
  
  export interface Motorista {
    nome: string
  }
  
  export interface ClienteOrigem {
    nome: string
    endereco: string
    bairro: string
    cidade: string
  }
  
  export interface ClienteDestino {
    nome: string
    endereco: string
    bairro: string
    cidade: string
  }