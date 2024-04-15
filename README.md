<p align="center">
  <img src="./public/favicon.svg" width="250" /> 
</p>

<br/>

## :bulb: Sobre

O **Ignite Call** é uma aplicação para criar eventos conectados ao Google Calendar.

## :page_with_curl: Pré-requisitos

1. Antes de começar, certifique-se de ter o Node.js instalado em sua máquina. 
    <a href="https://nodejs.org">
      <img width="30" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/>
    </a>

## :gear: Configuração

1. Clone o repositório para sua máquina local:

```bash
git clone https://github.com/carlos-hfc/ignite-call
```

2. Acesse o diretório do projeto:

```bash
cd ignite-call
```

3. Instale as dependências:

```bash
npm install
```

4. Crie um arquivo `.env.local` na raiz do projeto e adicione as seguinte chaves:

```env
# Prisma
DATABASE_URL=""
DATABASE_DIRECT_URL=""

# Cookies
COOKIE_PREFIX=""

# Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Deploy
NEXT_PUBLIC_URL=""
```

5. Rode a aplicação

```bash
npm run dev
```

## :computer_mouse: Uso da aplicação

1. Abra o navegador e acesse [http://localhost:3000](http://localhost:3000)
2. Efetue o seu cadastrado na plataforma e conecte a sua agenda do Google
3. Defina a sua disponibilidade
4. Crie eventos nos dias de sua escolha


## :computer: Tecnologias utilizadas

<p float="left">
  <img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/>
  <img width="50" src="https://user-images.githubusercontent.com/25181517/183890598-19a0ac2d-e88a-4005-a8df-1ee36782fde1.png" alt="TypeScript" title="TypeScript"/>
  <img width="50" src="https://github.com/marwin1991/profile-technology-icons/assets/136815194/5f8c622c-c217-4649-b0a9-7e0ee24bd704" alt="Next.js" title="Next.js"/>
</p>

## :page_facing_up: Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).