# Markdown Studio

Editor Markdown offline-first com prévia em tempo real, sumário automático, templates, exportação HTML e verificação segura de links. Projeto #009 da série **LAB//ABERTO**.

## Recursos

- Editor e prévia lado a lado.
- Títulos, listas, blockquotes, links, ênfase e fenced code blocks.
- Sumário navegável gerado automaticamente.
- Salvamento automático no `localStorage`.
- Templates para README, documentação e artigos.
- Exportação para um HTML autônomo.
- Verificação de até 20 links HTTP/HTTPS por execução.
- Bloqueio de localhost e redes privadas durante a verificação para reduzir SSRF.
- Sem banco de dados, contas ou serviços externos.

## Executar

Requer Node.js 20+.

```bash
npm start
```

Acesse `http://localhost:3000`.

Durante o desenvolvimento:

```bash
npm run dev
```

## Testes

```bash
npm run check
npm test
```

## Docker

```bash
docker compose up --build
```

## API

`GET /api/health`

`POST /api/check-links`

```json
{
  "links": ["https://github.com/", "https://example.com/"]
}
```

Links relativos e âncoras são mantidos como locais e não geram requisição externa.

## Segurança e privacidade

O documento Markdown permanece no navegador e é salvo apenas no armazenamento local do próprio browser. Somente URLs HTTP/HTTPS são enviadas ao backend quando o usuário solicita a verificação de links.

HTML bruto digitado no editor é escapado pelo renderer do MVP. Links com protocolos perigosos são substituídos por um destino bloqueado.

## Limites do MVP

- Parser deliberadamente compacto, não cobre toda a especificação CommonMark.
- Destaque de código usa estrutura e classes por linguagem, sem colorização semântica completa.
- Verificação de links usa `HEAD`; alguns sites podem rejeitar esse método apesar de estarem disponíveis.

## Independência

Projeto pessoal e independente. Não utiliza código, dados, processos ou propriedade intelectual de empregadores ou clientes.

## Licença

MIT.
