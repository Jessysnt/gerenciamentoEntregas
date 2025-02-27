# Gerenciamento de Transporte

## Descrição

Este projeto consiste no desenvolvimento de uma interface para acompanhar as entregas de uma transportadora. A aplicação segue boas práticas de desenvolvimento, incluindo qualidade de código, testes e documentação.

A interface é responsiva e intuitiva, garantindo uma experiência de usuário aprimorada e manipulação segura dos dados.

## Tecnologias Utilizadas

- **Angular 17**

- **Fuse Angular Template**

- **TypeScript**

- **RxJS/Ngrx** (Gerenciamento de estado)

- **Angular Material** (UI Responsiva)

  

  

## Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/Jessysnt/gerenciamentoEntregas.git
cd gerenciamentoEntregas
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar a aplicação

```bash
ng serve
```

A aplicação ficará disponível em `http://localhost:4200/`

### 4. Deploy no Netlify

O projeto pode ser implantado automaticamente no Netlify a partir da branch master. Após cada merge na master, o Netlify executa um novo build e disponibiliza a aplicação.

**Acesso à Aplicação**

- URL: https://gerenciamento-de-entregas.netlify.app

- Credenciais:

    - **E-mail: jess.santos@teste.com**

    - **Senha: admin**



## Funcionalidades Implementadas

### 1. **Dashboard**

- Tabela com andamento das entregas por motorista
- Tabela com entregas malsucedidas por motorista
- Tabela com andamento das entregas por bairro

### 2. **Lista de Entregas**

- Paginação de 10 em 10 registros
- Filtros por motorista e status

## Testes

O projeto conta com testes unitários para os componentes e serviços essenciais. Para executar os testes:

```bash
ng test
```

