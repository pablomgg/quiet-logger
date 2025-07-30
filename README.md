## Descrição

Quiet Logger é um bot do Discord que fornece funcionalidade de registro de logs para seu servidor Discord.
Atualmente o unico evento disparado de log é de saida de um canal de voz, guardando informações de usuário, canal e data do evento.
As tecnologias utilizadas na construção do bot foi Node.js e discord.js.

## Pré-requisitos

- Node.js (versão 16.x ou superior recomendada)
- npm (Gerenciador de Pacotes do Node)

## Dependências

- [discord.js](https://discord.js.org/) (v14.11.0) - Biblioteca para interação com a API do Discord
- [dotenv](https://www.npmjs.com/package/dotenv) (v16.3.1) - Para gerenciamento de variáveis de ambiente
- [nodemon](https://www.npmjs.com/package/nodemon) (v3.1.10) - Dependência de desenvolvimento para reinicialização automática da aplicação

## Instalação

1. Clone o repositório e entre na pasta do projeto:
```
git clone https://github.com/pablomgg/quiet-logger.git 
cd quiet-logger
```

2. Instale as dependências:
```
npm install
```

3. Create a `.env` file in the root directory and add your Discord bot token:
```
DISCORD_TOKEN=TOKEN-DO-APP
CLIENT_ID=ID-DO-APP
GUILD_ID=ID-DO-SERVIDOR #para desenvolvimento, em produção remover.
```

## Usando
1.  Para registrar os comandos slash no Discord, siga os passos:

- Execute o script de deploy:
    ```
    node deploy-commands.js
    ```

### Modos de Deploy

- **Desenvolvimento**: Os comandos são registrados apenas no servidor especificado em `GUILD_ID` e são atualizados instantaneamente.
  ```javascript
  Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
  ```

- **Produção**: Os comandos são registrados globalmente para todos os servidores, mas podem levar até 1 hora para propagar.
  ```javascript
  Routes.applicationCommands(process.env.CLIENT_ID)
  ```

> ⚠️ Para alternar entre os modos, comente/descomente o respectivo trecho no arquivo `deploy-commands.js`

Se o deploy for bem-sucedido, você verá as mensagens:
- 📡 Registrando comandos... 
- ✅ Comandos registrados!

2. Para iniciar o bot em modo de desenvolvimento (com reinicialização automática):
```
npm run dev
```

3. Para iniciar o bot em modo de produção:
```
npm start
```

## Comandos do Bot

### Comandos Slash (/)
- `/add-membro` - Adiciona um membro para monitoramento
    - Uso: `/add-membro usuario:@usuario`
    - Parâmetros:
        - `usuario` - Mencione o membro do servidor (obrigatório)
    - Resposta: Confirmação de que o membro foi adicionado à lista de monitoramento
    - Observações:
        - Comando disponível apenas dentro de servidores
        - A resposta é visível apenas para quem executou o comando
    - Exemplo:
      ```
      /add-membro usuario:@Usuario123
      ```
      > Resposta: 👤 Membro @Usuario123 adicionado à lista de monitoramento.

- `/remove-membro` - Remove um membro da lista de monitoramento
    - Uso: `/remove-membro usuario:@usuario`
    - Parâmetros:
        - `usuario` - Mencione o membro do servidor (obrigatório)
    - Restrições:
        - Comando disponível apenas dentro de servidores
        - A resposta é visível apenas para quem executou o comando
    - Exemplo:
      ```
      /remove-membro usuario:@Usuario123
      ```
      > Resposta: 🚫 Membro @Usuario123 removido da lista.
      
- `/add-voz` - Adiciona um canal de voz para monitoramento
    - Uso: `/add-voz canal:#canal-de-voz`
    - Parâmetros:
        - `canal` - Selecione um canal de voz (obrigatório)
    - Restrições:
        - Aceita apenas canais do tipo voz
        - Comando disponível apenas dentro de servidores
        - A resposta é visível apenas para quem executou o comando
    - Exemplo:
      ```
      /add-voz canal:#sala-de-reuniao
      ```
      > Resposta: ✅ Canal #sala-de-reuniao adicionado!

- `/remove-voz` - Remove um canal de voz da lista de monitoramento
    - Uso: `/remove-voz canal:#canal-de-voz`
    - Parâmetros:
        - `canal` - Selecione um canal de voz (obrigatório)
    - Restrições:
        - Aceita apenas canais do tipo voz
        - Comando disponível apenas dentro de servidores
        - A resposta é visível apenas para quem executou o comando
    - Exemplo:
      ```
      /remove-voz canal:#sala-de-reuniao
      ```
      > Resposta: 🚫 Canal #sala-de-reuniao removido da lista.

- `/set-log` - Define o canal de texto onde serão enviados os logs
    - Uso: `/set-log canal:#canal-de-texto`
    - Parâmetros:
        - `canal` - Selecione um canal de texto (obrigatório)
    - Restrições:
        - Aceita apenas canais do tipo texto
        - Comando disponível apenas dentro de servidores
        - A resposta é visível apenas para quem executou o comando
    - Exemplo:
      ```
      /set-log canal:#registro-de-logs
      ```
      > Resposta: 📨 Canal de log definido: #registro-de-logs

- `/listar-config` - Exibe a configuração atual do servidor
    - Uso: `/listar-config`
    - Parâmetros:
        - Nenhum
    - Restrições:
        - Comando disponível apenas dentro de servidores
        - A resposta é visível apenas para quem executou o comando
    - Exemplo:
      ```
      /listar-config
      ```
      > Resposta:
      > 🛠️ **Configuração atual:**
      > 📨 Canal de log: #registro-de-logs
      > 🔊 Canais de voz: #sala1, #sala2
      > 👥 Membros monitorados: @Usuario1, @Usuario2

## Armazenamento de Dados

### Formato Atual (JSON)
O bot atualmente utiliza um arquivo JSON (`config.json`) para armazenar as configurações. A estrutura do arquivo é:
```
{
  "2222222222222222222": {
    "voiceChannels": [
      "3333333333333333333",
      "4444444444444444444"
    ],
    "logChannel": "5555555555555555555",
    "members": [
      "6666666666666666666"
    ]
  },
  "7777777777777777777": {
    "voiceChannels": [
      "8888333333333333333",
      "9999444444444444444"
    ],
    "logChannel": "5555555555555559999",
    "members": [
      "6666666666666668888"
    ]
  }
}
```

Onde:
- `ID_DO_SERVIDOR`: ID único do servidor Discord
- `voiceChannels`: Array com IDs dos canais de voz monitorados
- `logChannel`: ID do canal onde os logs serão enviados
- `members`: Array com IDs dos membros monitorados

### Alternativa de Armazenamento
O sistema pode ser facilmente adaptado para usar um banco de dados NoSQL (como MongoDB) devido à natureza da estrutura de dados. A migração seria favorável em casos de:
- Grande número de servidores
- Necessidade de consultas mais complexas
- Backup e redundância de dados
- Melhor performance em produção

## Contributing

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.