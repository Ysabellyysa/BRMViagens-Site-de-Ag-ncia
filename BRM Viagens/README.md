# BRM Viagens — Protótipo de site de agência de viagens

Projeto acadêmico de desenvolvimento web: um site institucional/de reservas para a agência
fictícia **BRM Viagens**, construído apenas com **HTML5, CSS3 e JavaScript** (sem frameworks e
sem back-end). O foco é a apresentação do protótipo e a demonstração das páginas desenvolvidas.

---

## Apresentação

Durante a apresentação, o grupo deve apresentar o **protótipo do site desenvolvido**, com ênfase
na **demonstração das páginas elaboradas** (navegação real entre as telas, filtros, wizard de
cadastro, galeria de pacotes e fluxo de reserva).

> **Código fonte:** não é necessário apresentar o código durante a apresentação. O código só deve
> ser exibido caso haja dúvidas específicas da turma que exijam esclarecimento técnico.

### Roteiro sugerido de demonstração

1. **Início (`index.html`)** — hero com busca rápida, filtros por perfil de viajante e grade de destinos.
2. **Explorar (`explorar.html`)** — painel de filtros combinados (perfil, faixa de preço, duração,
   tags, datas) e a área “Outros destinos”.
3. **Destino (`destino.html`)** — catálogo com 8 destinos: clicar em uma foto troca a imagem em
   destaque e atualiza nome, descrição, duração e preços no resumo lateral; a tabela de datas é
   reconstruída para o destino escolhido e ajusta a saída e a disponibilidade.
4. **Reserva (`reserva.html`)** — formulário do titular, abas de pagamento (cartão/Pix), resumo da
   compra e tela de confirmação com número do pedido.
5. **Login (`entrar.html`)** — escolha entre acesso de viajante e de administrador.
6. **Wizards de cadastro (`criar-perfil.html` e `criar-admin.html`)** — cadastro em 5 etapas com
   barra de progresso, validação e resumo atualizado em tempo real.
7. **Perfil e painéis (`perfil.html`, `admin.html`, `painel-admin.html`)** — áreas logadas do
   viajante e do administrador.

---

## Tecnologias utilizadas

- **HTML5** — estrutura semântica (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`),
  formulários com rótulos, tabelas com `caption`/`scope`, atributos de acessibilidade (`aria-*`, `role`).
- **CSS3** — variáveis (`:root`), Flexbox, CSS Grid, responsividade com `@media`, animações
  (`@keyframes`), gradientes e transições.
- **JavaScript (puro)** — manipulação do DOM, filtros, wizard por etapas, cálculo de totais e
  mensagens de feedback (toast).

---

## Estrutura do projeto

```
BRM Viagens/
├── index.html            # Página inicial
├── explorar.html         # Busca e filtros de destinos
├── destino.html          # Catálogo de destinos com detalhes e datas
├── reserva.html          # Finalização da reserva
├── entrar.html           # Login (viajante / administrador)
├── perfil.html           # Perfil do viajante
├── criar-perfil.html     # Cadastro de viajante (wizard de 5 etapas)
├── admin.html            # Página de apresentação do perfil administrador
├── criar-admin.html      # Cadastro de administrador (wizard de 5 etapas)
├── painel-admin.html     # Painel do administrador
├── css/
│   └── estilo.css        # Folha de estilos única e responsiva
├── js/
│   └── script.js         # Toda a interatividade do site
└── imagens/              # Logos, favicons e fotos dos destinos
```

---

## Páginas

| Arquivo | Descrição |
| --- | --- |
| `index.html` | Hero com busca rápida, filtros por perfil, grade de 14 destinos, pilares da agência e CTA final. |
| `explorar.html` | Painel lateral com filtros combinados e grade de resultados; seção “Outros destinos”. |
| `destino.html` | Catálogo de 8 destinos: clique troca foto, descrição e preços; tabela de datas e painel lateral de resumo. |
| `reserva.html` | Dados do titular, pagamento em abas (cartão/Pix), resumo dinâmico e confirmação do pedido. |
| `entrar.html` | Escolha do tipo de acesso (viajante ou administrador). |
| `perfil.html` | Cabeçalho do viajante, estatísticas, abas de reservas/favoritos e benefícios. |
| `criar-perfil.html` | Wizard de 5 etapas para criar o perfil de viajante, com revisão e resumo lateral. |
| `admin.html` | Página de captação: etapas da inscrição, benefícios e planos de comissão. |
| `criar-admin.html` | Wizard de 5 etapas para o cadastro do perfil administrador. |
| `painel-admin.html` | Painel com indicadores, hóspedes, certificado, avaliações e próximos passos. |

---

## Como executar

Não há dependências nem etapa de build. Basta abrir o arquivo `index.html` no navegador
(duplo-clique) ou, preferencialmente, servir a pasta com um servidor local para que os caminhos
relativos funcionem corretamente:

```powershell
# Python 3
python -m http.server 8000
# depois acesse http://localhost:8000
```

---

## Funcionalidades em destaque

- **Filtros combinados** em `explorar.html`: texto, perfil, faixa de preço (com mínimo e máximo),
  duração, tags e período de viagem.
- **Catálogo de destinos** em `destino.html`: cada foto é um destino e, ao clicar, atualiza a imagem
  em destaque, o nome, a descrição, a duração e os preços (tarifa, total e parcelas) no resumo lateral.
- **Tabela de datas por destino** em `destino.html`: as próximas saídas são reconstruídas a cada
  destino selecionado; escolher uma linha atualiza a saída e a disponibilidade no resumo lateral.
- **Wizard de cadastro** com validação por etapa, barra de progresso e resumo em tempo real.
- **Reserva** com cálculo de total, parcelamento (valor base + taxa de proteção) e número de pedido.
- **Acessibilidade**: rótulos em todos os campos, `aria-*` nos componentes interativos, foco visível
  e contraste de cores.

---

## Critérios de avaliação

**Site**

- Uso adequado das tags HTML e das propriedades CSS estudadas na disciplina, quando aplicável;
- Qualidade da interface;
- Facilidade de navegação;
- Ausência de bugs.

**Apresentação no dia previsto**

- Cumprimento do cronograma estabelecido para as apresentações (no dia **07/10/2026** será realizado
  o sorteio da ordem de apresentação dos grupos).

**Tempo de apresentação**

- Respeito ao tempo estipulado de **15 a 20 minutos por grupo**.

**Organização da apresentação**

- Clareza e objetividade na exposição;
- Distribuição de falas entre os integrantes;
- Domínio do conteúdo apresentado.

---

## Checklist de demonstração

- [ ] Abrir a página inicial e apresentar a busca rápida.
- [ ] Demonstrar os filtros por perfil na página inicial.
- [ ] Passar por `explorar.html` e combinar filtros.
- [ ] Mostrar a galeria de pacotes e a tabela de datas em `destino.html`.
- [ ] Concluir uma reserva em `reserva.html` (cartão e Pix).
- [ ] Demonstrar o wizard de cadastro em `criar-perfil.html`.
- [ ] Mostrar o perfil (`perfil.html`) e o painel do admin (`painel-admin.html`).

---

*Projeto acadêmico — BRM Viagens. © 2026. Todos os direitos reservados.*
