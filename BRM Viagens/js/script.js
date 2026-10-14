const toast = document.querySelector(".toast");
let toastTimer = null;

function mostrarToast(mensagem) {
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.add("toast--visivel");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("toast--visivel");
  }, 3200);
}

const formularioBusca = document.querySelector("#formularioBusca");

if (formularioBusca) {
  formularioBusca.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(formularioBusca);
    const destino = String(dados.get("destino") || "").trim();
    const categoria = String(dados.get("categoria") || "todos").trim();
    const pessoas = String(dados.get("pessoas") || "2").trim();

    const parametros = new URLSearchParams();
    if (destino) parametros.set("q", destino);
    if (categoria && categoria !== "todos") parametros.set("categoria", categoria);
    parametros.set("pessoas", pessoas);

    window.location.href = "explorar.html?" + parametros.toString();
  });

  document.querySelectorAll("[data-sugestao]").forEach((botao) => {
    botao.addEventListener("click", () => {
      const campo = formularioBusca.querySelector("[name='destino']");
      if (!campo) return;
      campo.value = botao.dataset.sugestao;
      campo.focus();
    });
  });
}

const botoesFiltro = document.querySelectorAll(".filtro");
const cartoesDestino = document.querySelectorAll(".destino");
const avisoVazio = document.querySelector("#semResultados");
const contadorDestinos = document.querySelector("#contadorDestinos");

function aplicarFiltro(categoriaAtiva) {
  let visiveis = 0;

  botoesFiltro.forEach((botao) => {
    const ativo = botao.dataset.categoria === categoriaAtiva;
    botao.setAttribute("aria-pressed", ativo ? "true" : "false");
  });

  cartoesDestino.forEach((cartao) => {
    const categorias = (cartao.dataset.categorias || "").split(" ");
    const deveAparecer = categoriaAtiva === "todos" || categorias.includes(categoriaAtiva);
    cartao.classList.toggle("destino--oculto", !deveAparecer);
    if (deveAparecer) visiveis += 1;
  });

  if (avisoVazio) avisoVazio.style.display = visiveis === 0 ? "block" : "none";
  if (contadorDestinos) {
    contadorDestinos.textContent =
      visiveis === 1 ? "1 destino encontrado" : visiveis + " destinos encontrados";
  }
}

botoesFiltro.forEach((botao) => {
  botao.addEventListener("click", () => {
    aplicarFiltro(botao.dataset.categoria);
    document.querySelector("#destinos").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const filtroDaUrl = new URLSearchParams(window.location.search).get("categoria");
aplicarFiltro(filtroDaUrl || "todos");

document.querySelectorAll(".destino__coracao").forEach((botao) => {
  botao.addEventListener("click", () => {
    const ativo = botao.classList.toggle("destino__coracao--ativo");
    botao.textContent = ativo ? "♥" : "♡";
    botao.setAttribute("aria-pressed", ativo ? "true" : "false");
    mostrarToast(ativo ? "Destino salvo nos seus favoritos." : "Destino removido dos favoritos.");
  });
});

const contaMenu = document.querySelector(".conta");

if (contaMenu) {
  const gatilhoConta = contaMenu.querySelector(".perfil-atalho");
  const listaConta = contaMenu.querySelector(".conta__menu");

  const abrirConta = (aberto) => {
    if (!gatilhoConta || !listaConta) return;
    gatilhoConta.setAttribute("aria-expanded", aberto ? "true" : "false");
    listaConta.hidden = !aberto;
  };

  if (gatilhoConta && listaConta) {
    gatilhoConta.addEventListener("click", (evento) => {
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey) return;
      evento.preventDefault();
      abrirConta(gatilhoConta.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("click", (evento) => {
      if (!contaMenu.contains(evento.target)) abrirConta(false);
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key !== "Escape") return;
      if (gatilhoConta.getAttribute("aria-expanded") !== "true") return;
      abrirConta(false);
      gatilhoConta.focus();
    });
  }
}

document.querySelectorAll("[data-alvo='#formularioBusca']").forEach((elemento) => {
  elemento.addEventListener("click", (evento) => {
    evento.preventDefault();
    const campo = document.querySelector("[name='destino']");
    if (campo) {
      campo.focus();
      campo.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

document.querySelectorAll("[data-aviso]").forEach((elemento) => {
  elemento.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarToast(elemento.dataset.aviso);
  });
});

const painelExplorar = document.querySelector("#painelExplorar");
const cartoesExplorar = document.querySelectorAll(".cartao");
const contadorExplorar = document.querySelector("#contadorExplorar");
const avisoExplorar = document.querySelector("#avisoExplorar");
const botaoLimpar = document.querySelector("#limparFiltros");
const gradeExplorar = document.querySelector("#gradeExplorar");
const blocoOutros = document.querySelector("#blocoOutros");
const gradeOutros = document.querySelector("#gradeOutros");
const contadorOutros = document.querySelector("#contadorOutros");

function valoresMarcados(nome) {
  return Array.from(document.querySelectorAll(`#painelExplorar input[name="${nome}"]:checked`)).map(
    (campo) => campo.value
  );
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filtrarExplorar() {
  if (!painelExplorar || cartoesExplorar.length === 0) return;

  const textoDigitado = normalizar(document.querySelector("#explorarBusca")?.value || "");
  const perfilMarcado = document.querySelector('#painelExplorar input[name="perfil"]:checked');
  const perfil = perfilMarcado && perfilMarcado.value !== "todos" ? perfilMarcado : null;
  const estrelas = valoresMarcados("estrelas").map(Number);
  const duracoes = valoresMarcados("duracao").map(Number);
  const tags = valoresMarcados("tag");
  const faixasPreco = Array.from(
    document.querySelectorAll('#painelExplorar input[name="preco"]:checked')
  ).map((campo) => ({
    min: Number(campo.dataset.min),
    max: campo.dataset.max ? Number(campo.dataset.max) : Infinity,
  }));

  let prioritarios = 0;
  let outros = 0;

  cartoesExplorar.forEach((cartao) => {
    const nome = normalizar(cartao.dataset.nome || "");
    const perfis = (cartao.dataset.perfil || "").split(" ");
    const preco = Number(cartao.dataset.preco);
    const nota = Number(cartao.dataset.estrelas);
    const duracao = Number(cartao.dataset.duracao);
    const tagsCartao = (cartao.dataset.tags || "").split(" ");

    const combina =
      (!textoDigitado || nome.includes(textoDigitado)) &&
      (!perfil || perfis.includes(perfil.value)) &&
      (!faixasPreco.length || faixasPreco.some((faixa) => preco >= faixa.min && preco <= faixa.max)) &&
      (!estrelas.length || estrelas.includes(nota)) &&
      (!duracoes.length || duracoes.includes(duracao)) &&
      (!tags.length || tags.some((tag) => tagsCartao.includes(tag)));

    cartao.classList.remove("cartao--oculto");

    if (combina) {
      if (gradeExplorar && cartao.parentElement !== gradeExplorar) gradeExplorar.appendChild(cartao);
      prioritarios += 1;
    } else {
      if (gradeOutros && cartao.parentElement !== gradeOutros) gradeOutros.appendChild(cartao);
      outros += 1;
    }
  });

  if (contadorExplorar) {
    contadorExplorar.textContent =
      prioritarios === 1 ? "1 destino encontrado" : prioritarios + " destinos encontrados";
  }

  if (avisoExplorar) avisoExplorar.style.display = prioritarios === 0 ? "block" : "none";

  if (blocoOutros) {
    blocoOutros.hidden = outros === 0;
    if (contadorOutros) contadorOutros.textContent = outros > 0 ? "(" + outros + ")" : "";
  }
}

if (painelExplorar) {
  painelExplorar.addEventListener("change", filtrarExplorar);
  painelExplorar.addEventListener("input", filtrarExplorar);

  painelExplorar.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      const campo = tag.querySelector("input");
      if (!campo) return;
      tag.classList.toggle("tag--ativa", campo.checked);
      filtrarExplorar();
    });
  });

  const sincronizarPerfil = (avisar) => {
    const marcado = document.querySelector('#painelExplorar input[name="perfil"]:checked');
    painelExplorar.querySelectorAll(".opcao-perfil").forEach((opcao) => {
      opcao.classList.toggle("opcao-perfil--ativa", opcao.querySelector("input").checked);
    });
    if (avisar && marcado) {
      mostrarToast("Perfil desejado: " + marcado.parentElement.textContent.trim() + ".");
    }
  };

  painelExplorar.querySelectorAll('input[name="perfil"]').forEach((campo) => {
    campo.addEventListener("change", () => sincronizarPerfil(true));
  });
  sincronizarPerfil(false);

  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", () => {
      painelExplorar.querySelectorAll('input[type="checkbox"]').forEach((campo) => {
        campo.checked = false;
      });
      painelExplorar.querySelectorAll("input[type='radio']").forEach((campo) => {
        if (campo.value === "todos") campo.checked = true;
      });
      sincronizarPerfil(false);
      const busca = document.querySelector("#explorarBusca");
      if (busca) busca.value = "";
painelExplorar.querySelectorAll(".tag").forEach((tag) => tag.classList.remove("tag--ativa"));
      const blocoDatas = document.querySelector("#blocoDatas");
      if (blocoDatas) blocoDatas.hidden = false;
      const saida = document.querySelector("#datasSaida");
      const volta = document.querySelector("#datasVolta");
      if (saida) saida.value = "";
      if (volta) volta.value = "";
      const periodo = document.querySelector("#periodoEscolhido");
      if (periodo) periodo.textContent = "Escolha as datas para refinar a busca";
      filtrarExplorar();
      mostrarToast("Filtros limpos. Mostrando todos os destinos.");
    });
  }

  const alternadorDatas = document.querySelector("#datasFlexiveis");
  const blocoDatas = document.querySelector("#blocoDatas");
  const campoSaida = document.querySelector("#datasSaida");
  const campoVolta = document.querySelector("#datasVolta");

  if (alternadorDatas && blocoDatas) {
    blocoDatas.hidden = alternadorDatas.checked;
    alternadorDatas.addEventListener("change", () => {
      blocoDatas.hidden = alternadorDatas.checked;
      if (alternadorDatas.checked) {
        if (campoSaida) campoSaida.value = "";
        if (campoVolta) campoVolta.value = "";
      } else if (campoSaida) {
        campoSaida.focus();
      }
    });
  }

  if (campoSaida || campoVolta) {
    const hoje = new Date();
    const isoHoje = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

    if (campoSaida) campoSaida.min = isoHoje;
    if (campoVolta) campoVolta.min = isoHoje;

    const sincronizarPeriodo = () => {
      const saida = campoSaida ? campoSaida.value : "";
      const volta = campoVolta ? campoVolta.value : "";
      const periodo = document.querySelector("#periodoEscolhido");
      if (!periodo) return;

      if (campoVolta) campoVolta.min = saida || isoHoje;

      if (campoSaida && saida && volta && volta < saida) {
        campoVolta.value = saida;
        mostrarToast("A volta foi ajustada para a mesma data da saída.");
      }

      const escolhidaSaida = campoSaida ? campoSaida.value : "";
      const escolhidaVolta = campoVolta ? campoVolta.value : "";

      if (escolhidaSaida && escolhidaVolta) {
        const formatar = (data) => data.split("-").reverse().join("/");
        periodo.textContent = "Período escolhido: " + formatar(escolhidaSaida) + " até " + formatar(escolhidaVolta);
      } else {
        periodo.textContent = "Escolha as datas para refinar a busca";
      }
    };

    [campoSaida, campoVolta].forEach((entrada) => {
      if (entrada) entrada.addEventListener("change", sincronizarPeriodo);
    });
  }
}

const parametrosExplorar = new URLSearchParams(window.location.search);
const buscaInicial = document.querySelector("#explorarBusca");
const perfilInicial = document.querySelector('input[name="perfil"]');
if (buscaInicial && parametrosExplorar.get("q")) buscaInicial.value = parametrosExplorar.get("q");
if (perfilInicial && parametrosExplorar.get("categoria")) {
  const alvo = document.querySelector(
    `#painelExplorar input[name="perfil"][value="${parametrosExplorar.get("categoria")}"]`
  );
  if (alvo) alvo.checked = true;
}
filtrarExplorar();

const imagemPrincipal = document.querySelector("#imagemDestaque");
const corpoSaidas = document.querySelector("#destinoSaidas");
const VIAJANTES_DESTINO = 2;

function definirPainel(nome, texto) {
  document.querySelectorAll("[data-painel='" + nome + "']").forEach((elemento) => {
    elemento.textContent = texto;
  });
}

function formatarReais(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const IMAGEM_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1200'%20height='800'%3E%3Crect%20width='1200'%20height='800'%20fill='%23eae4f6'/%3E%3Ctext%20x='600'%20y='400'%20fill='%236b5fa0'%20font-family='Arial,sans-serif'%20font-size='54'%20text-anchor='middle'%20dominant-baseline='middle'%3EFoto%20em%20breve%3C/text%3E%3C/svg%3E";

function tratarImagemAusente(imagem) {
  const trocar = () => {
    if (imagem.src.indexOf("data:") !== 0) imagem.src = IMAGEM_PLACEHOLDER;
  };
  imagem.addEventListener("error", trocar);
  if (imagem.complete && imagem.naturalWidth === 0) trocar();
}

document.querySelectorAll(".miniatura img, #imagemDestaque").forEach(tratarImagemAusente);

const AGENDA_DESTINOS = {
  mantiqueira: [
    { data: "12/11/2026", disponibilidade: "Vagas abertas", preco: 2480 },
    { data: "03/12/2026", disponibilidade: "Últimas vagas", preco: 2590 },
    { data: "10/01/2027", disponibilidade: "Vagas abertas", preco: 2480 },
  ],
  lencois: [
    { data: "08/11/2026", disponibilidade: "Vagas abertas", preco: 3120 },
    { data: "29/11/2026", disponibilidade: "Últimas vagas", preco: 3290 },
    { data: "20/12/2026", disponibilidade: "Esgotado", preco: 3480 },
  ],
  noronha: [
    { data: "15/11/2026", disponibilidade: "Últimas vagas", preco: 4890 },
    { data: "06/12/2026", disponibilidade: "Vagas abertas", preco: 4690 },
    { data: "17/01/2027", disponibilidade: "Vagas abertas", preco: 4890 },
  ],
  pantanal: [
    { data: "05/11/2026", disponibilidade: "Vagas abertas", preco: 2950 },
    { data: "26/11/2026", disponibilidade: "Vagas abertas", preco: 2950 },
    { data: "14/12/2026", disponibilidade: "Últimas vagas", preco: 3150 },
  ],
  salvador: [
    { data: "02/11/2026", disponibilidade: "Vagas abertas", preco: 1780 },
    { data: "23/11/2026", disponibilidade: "Vagas abertas", preco: 1780 },
    { data: "28/12/2026", disponibilidade: "Esgotado", preco: 2150 },
  ],
  gramado: [
    { data: "10/11/2026", disponibilidade: "Vagas abertas", preco: 1980 },
    { data: "01/12/2026", disponibilidade: "Últimas vagas", preco: 2080 },
    { data: "22/12/2026", disponibilidade: "Esgotado", preco: 2680 },
  ],
  ouropreto: [
    { data: "07/11/2026", disponibilidade: "Vagas abertas", preco: 1640 },
    { data: "28/11/2026", disponibilidade: "Vagas abertas", preco: 1640 },
    { data: "19/12/2026", disponibilidade: "Últimas vagas", preco: 1750 },
  ],
  ilhademel: [
    { data: "09/11/2026", disponibilidade: "Vagas abertas", preco: 2150 },
    { data: "30/11/2026", disponibilidade: "Últimas vagas", preco: 2250 },
    { data: "21/12/2026", disponibilidade: "Vagas abertas", preco: 2150 },
  ],
};

function classeDisponibilidade(texto) {
  const normalizado = String(texto || "").toLowerCase();
  if (normalizado.indexOf("esgot") > -1) return "selo-disponibilidade--esgotado";
  if (normalizado.indexOf("ltima") > -1) return "selo-disponibilidade--ultimas";
  return "selo-disponibilidade--vagas";
}

function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, (caractere) => {
    const entidades = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return entidades[caractere];
  });
}

function ligarLinhasSaida() {
  const linhas = document.querySelectorAll(".tabela__linha");

  linhas.forEach((linha) => {
    linha.addEventListener("click", () => {
      linhas.forEach((outra) => outra.classList.remove("tabela__linha--ativa"));
      linha.classList.add("tabela__linha--ativa");

      document.querySelectorAll("[data-painel='saida']").forEach((elemento) => {
        elemento.textContent = linha.dataset.saida;
      });
      document.querySelectorAll("[data-painel='disponibilidade']").forEach((elemento) => {
        elemento.textContent = linha.dataset.disponibilidade;
      });
    });
  });

  return linhas;
}

function renderizarSaidas(chave, duracao) {
  if (!corpoSaidas) return;

  const agenda = AGENDA_DESTINOS[chave];
  if (!Array.isArray(agenda) || agenda.length === 0) return;

  corpoSaidas.innerHTML = agenda
    .map((item, indice) => {
      const selo = classeDisponibilidade(item.disponibilidade);
      return (
        '<tr class="tabela__linha' + (indice === 0 ? " tabela__linha--ativa" : "") + '" tabindex="0"' +
        ' data-saida="' + escaparHtml(item.data) + '"' +
        ' data-disponibilidade="' + escaparHtml(item.disponibilidade) + '">' +
        "<td>" + escaparHtml(item.data) + "</td>" +
        "<td>" + escaparHtml(duracao) + "</td>" +
        '<td><span class="selo-disponibilidade ' + selo + '">' + escaparHtml(item.disponibilidade) + "</span></td>" +
        "<td>R$ " + Number(item.preco).toLocaleString("pt-BR") + "</td>" +
        "</tr>"
      );
    })
    .join("");

  const linhas = ligarLinhasSaida();
  if (linhas.length > 0) linhas[0].click();
}

function selecionarPacote(miniatura) {
  document.querySelectorAll(".miniatura").forEach((outra) => {
    const ativa = outra === miniatura;
    outra.classList.toggle("miniatura--ativa", ativa);
    outra.setAttribute("aria-pressed", ativa ? "true" : "false");
  });

  if (imagemPrincipal) {
    imagemPrincipal.src = miniatura.dataset.imagem;
    imagemPrincipal.alt = miniatura.dataset.legenda || imagemPrincipal.alt;
  }

  const preco = Number(miniatura.dataset.preco) || 0;
  const total = preco * VIAJANTES_DESTINO;

  document.querySelectorAll("[data-painel='pacote']").forEach((elemento) => {
    elemento.textContent = miniatura.dataset.pacote || "";
  });
  document.querySelectorAll("[data-painel='descricao']").forEach((elemento) => {
    elemento.textContent = miniatura.dataset.descricao || "";
  });
  document.querySelectorAll("[data-painel='duracao']").forEach((elemento) => {
    elemento.textContent = miniatura.dataset.duracao || "";
  });
  document.querySelectorAll("[data-painel='tarifa']").forEach((elemento) => {
    elemento.textContent = formatarReais(preco);
  });
  document.querySelectorAll("[data-painel='total']").forEach((elemento) => {
    elemento.textContent = formatarReais(total);
  });
  document.querySelectorAll("[data-painel='parcelas']").forEach((elemento) => {
    elemento.textContent =
      "Ou em até 6x de " + formatarReais(total / 6) + " sem juros. Taxa de proteção BRM inclusa na próxima etapa.";
  });

  renderizarSaidas(miniatura.dataset.chave, miniatura.dataset.duracao);
}

if (imagemPrincipal) {
  document.querySelectorAll(".miniatura").forEach((miniatura) => {
    miniatura.setAttribute(
      "aria-pressed",
      miniatura.classList.contains("miniatura--ativa") ? "true" : "false"
    );
    miniatura.addEventListener("click", () => selecionarPacote(miniatura));
  });

  const miniaturaAtiva = document.querySelector(".miniatura--ativa");
  if (miniaturaAtiva) selecionarPacote(miniaturaAtiva);
}

const abasPagamento = document.querySelectorAll(".aba");

abasPagamento.forEach((aba) => {
  aba.addEventListener("click", () => {
    abasPagamento.forEach((outra) => {
      outra.classList.remove("aba--ativa");
      outra.setAttribute("aria-selected", "false");
    });
    aba.classList.add("aba--ativa");
    aba.setAttribute("aria-selected", "true");

    document.querySelectorAll(".aba-painel").forEach((painel) => painel.classList.remove("aba-painel--ativo"));
    const alvo = document.querySelector("#" + aba.dataset.aba);
    if (alvo) {
      alvo.classList.add("aba-painel--ativo");
      const primeiroCampo = alvo.querySelector("input");
      if (primeiroCampo) primeiroCampo.focus({ preventScroll: true });
    }
  });
});

const seletorPessoas = document.querySelector("#quantidadePessoas");
const seletorParcelas = document.querySelector("#parcelasCartao");
const VALOR_BASE = 2480;
const TAXA_PROTECAO = 79;

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarTotalReserva() {
  const pessoas = seletorPessoas ? Number(seletorPessoas.value) : 2;
  const bruto = VALOR_BASE * pessoas;
  const taxas = TAXA_PROTECAO * pessoas;
  const total = bruto + taxas;

  const definir = (seletor, texto) => {
    const elemento = document.querySelector(seletor);
    if (elemento) elemento.textContent = texto;
  };

  definir("#resumoViagens", pessoas === 1 ? "1 pessoa" : pessoas + " pessoas");
  definir("#resumoBruto", formatarMoeda(bruto));
  definir("#resumoTaxas", formatarMoeda(taxas));
  definir("#resumoTotal", formatarMoeda(total));

  if (seletorParcelas) {
    Array.from(seletorParcelas.options).forEach((opcao) => {
      const quantidade = Number(opcao.value);
      opcao.textContent =
        quantidade === 1
          ? "À vista — sem juros"
          : quantidade + "x de " + formatarMoeda(total / quantidade) + " sem juros";
    });

    const parcelas = Number(seletorParcelas.value);
    definir(
      "#resumoParcelas",
      parcelas === 1
        ? "À vista, sem juros"
        : "ou " + parcelas + "x de " + formatarMoeda(total / parcelas) + " sem juros"
    );
  }
}

if (seletorPessoas) {
  seletorPessoas.addEventListener("change", atualizarTotalReserva);
  atualizarTotalReserva();
}

if (seletorParcelas) {
  seletorParcelas.addEventListener("change", atualizarTotalReserva);
}

const formularioReserva = document.querySelector("#formularioReserva");

if (formularioReserva) {
  formularioReserva.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const abaPix = document.querySelector("#painelPix.aba-painel--ativo");
    let pagamentoEscolhido = "Pix";
    if (!abaPix && seletorParcelas) {
      const opcao = seletorParcelas.options[seletorParcelas.selectedIndex];
      pagamentoEscolhido = "Cartão de crédito — " + opcao.text;
    } else if (!abaPix) {
      pagamentoEscolhido = "Cartão de crédito";
    }

    const pedido = "BRM-" + Math.floor(100000 + Math.random() * 899999);
    const numeroPedido = document.querySelector("#numeroPedido");
    if (numeroPedido) numeroPedido.textContent = pedido;

    const formaPagamento = document.querySelector("#resumoPagamento");
    if (formaPagamento) formaPagamento.textContent = pagamentoEscolhido;

    const titular = document.querySelector("#titularReserva");
    if (titular && document.querySelector("[name='nomeCompleto']").value.trim()) {
      titular.textContent = document.querySelector("[name='nomeCompleto']").value.trim();
    }

    const secoes = document.querySelectorAll("[data-etapa-reserva]");
    const confirmacao = document.querySelector("#minhaReserva");
    secoes.forEach((secao) => {
      secao.hidden = true;
    });
    if (confirmacao) {
      confirmacao.hidden = false;
      confirmacao.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    mostrarToast("Reserva confirmada! Pedido " + pedido + " emitido.");
  });
}

document.querySelectorAll(".seletor").forEach((seletor) => {
  seletor.addEventListener("click", (evento) => {
    const item = evento.target.closest(".seletor__item");
    if (!item) return;
    seletor.querySelectorAll(".seletor__item").forEach((outro) => {
      outro.classList.remove("seletor__item--ativa");
      outro.setAttribute("aria-pressed", "false");
    });
    item.classList.add("seletor__item--ativa");
    item.setAttribute("aria-pressed", "true");
    atualizarResumoWizard(seletor.closest("[data-wizard]"));
  });
});

const wizards = document.querySelectorAll("[data-wizard]");

function atualizarResumoWizard(wizard) {
  if (!wizard) return;
  const resumo = wizard.querySelector(".resumo-wizard");
  if (!resumo) return;

  resumo.querySelectorAll("[data-resumo]").forEach((elemento) => {
    const etapa = elemento.dataset.resumo;
    const etapaWizard = wizard.querySelector('#etapa-' + etapa);
    if (!etapaWizard) return;

    const selecionado = etapaWizard.querySelector(".seletor__item--ativa");
    const rotulos = {
      categoria: "perfilViajante",
      hospedagem: "perfilHospedagem",
    };

    if (selecionado) {
      const titulo = selecionado.querySelector(".seletor__titulo");
      const linha = resumo.querySelector('[data-linha="' + (rotulos[etapa] || "perfil") + '"] strong');
      if (linha) linha.textContent = titulo ? titulo.textContent : "";
    }

    etapaWizard.querySelectorAll("input:not([type='checkbox']):not([type='radio']), select, textarea").forEach((campo) => {
      if (!campo.value.trim()) return;
      const rotulo = rotulos[etapa] || campo.name;
      const linha = resumo.querySelector('[data-linha="' + campo.name + '"] strong');
      if (!linha) return;
      if (campo.type === "file") {
        linha.textContent = campo.files && campo.files.length ? campo.files[0].name : "";
      } else if (campo.type === "password") {
        linha.textContent = "•".repeat(campo.value.length);
      } else if (campo.tagName === "SELECT") {
        linha.textContent = campo.options[campo.selectedIndex].text;
      } else {
        linha.textContent = campo.value;
      }
      void rotulo;
    });

    const aceite = etapaWizard.querySelector('input[type="checkbox"]');
    const linhaAceite = resumo.querySelector('[data-linha="aceite"] strong');
    if (linhaAceite && aceite) linhaAceite.textContent = aceite.checked ? "Aceito" : "Pendente";
  });

  const vazios = resumo.querySelectorAll("[data-resumo] .resumo-wizard__vazio");
  vazios.forEach((vazio) => {
    const etapaWizard = wizard.querySelector("#etapa-" + vazio.closest("[data-resumo]").dataset.resumo);
    const preenchido = resumo.querySelector(
      '[data-linha="' + vazio.dataset.campo + '"] strong'
    );
    vazio.style.display = preenchido && preenchido.textContent.trim() ? "none" : "block";
    if (etapaWizard) etapaWizard.dataset.consultado = "true";
  });

  wizard.querySelectorAll("[data-revisao] strong").forEach((valor) => {
    const chave = valor.closest("[data-revisao]").dataset.revisao;
    const origem = resumo.querySelector('[data-linha="' + chave + '"] strong');
    valor.textContent = origem && origem.textContent.trim() ? origem.textContent : "—";
  });
}

wizards.forEach((wizard) => {
  const etapas = Array.from(wizard.querySelectorAll(".etapa"));
  const passos = Array.from(wizard.querySelectorAll(".progresso__passo"));
  let atual = 0;

  function mostrarEtapa(indice) {
    atual = indice;
    etapas.forEach((etapa, i) => etapa.classList.toggle("etapa--ativa", i === indice));
    passos.forEach((passo, i) => {
      passo.classList.toggle("etapa--ativa", false);
      passo.classList.toggle("progresso__passo--ativo", i === indice);
      passo.classList.toggle("progresso__passo--concluido", i < indice);
    });
    atualizarResumoWizard(wizard);
  }

  wizard.querySelectorAll("[data-avancar]").forEach((botao) => {
    botao.addEventListener("click", () => mostrarEtapa(Math.min(atual + 1, etapas.length - 1)));
  });

  wizard.querySelectorAll("[data-voltar]").forEach((botao) => {
    botao.addEventListener("click", () => mostrarEtapa(Math.max(atual - 1, 0)));
  });

  wizard.querySelectorAll(".etapa").forEach((etapa) => {
    etapa.addEventListener("input", () => atualizarResumoWizard(wizard));
    etapa.addEventListener("change", () => atualizarResumoWizard(wizard));
  });

  const formulario = wizard.querySelector("form");
  if (formulario) {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const etapaAtual = etapas[atual];
      const obrigatorios = Array.from(
        etapaAtual.querySelectorAll("input[required], select[required]")
      ).filter((campo) => campo.type !== "checkbox");

      const faltando = obrigatorios.filter((campo) => !campo.value.trim());
      if (faltando.length > 0) {
        faltando[0].focus();
        mostrarToast("Preencha os campos da etapa " + (atual + 1) + " para continuar.");
        return;
      }

      const aceite = etapaAtual.querySelector('input[type="checkbox"][required]');
      if (aceite && !aceite.checked) {
        aceite.focus();
        mostrarToast("Aceite os Termos de Uso e a Política de Privacidade para concluir.");
        return;
      }

      if (atual < etapas.length - 1) {
        mostrarEtapa(atual + 1);
        return;
      }

      mostrarToast("Conta criada com sucesso! Enviamos a confirmação para o seu e-mail.");
      const sucesso = document.querySelector("#sucessoConta");
      if (sucesso) {
        sucesso.hidden = false;
        sucesso.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      wizard.querySelectorAll(".seletor__item--ativa, [data-avancar], [data-voltar]").forEach((item) => {
        item.disabled = true;
      });
    });
  }

  mostrarEtapa(0);
});

const painelPerfil = document.querySelector("#painelPerfil");

if (painelPerfil) {
  painelPerfil.querySelectorAll("[data-aba-perfil]").forEach((aba) => {
    aba.addEventListener("click", () => {
      painelPerfil.querySelectorAll("[data-aba-perfil]").forEach((outra) => {
        outra.classList.toggle("navegacao__link--ativo", outra === aba);
      });
      painelPerfil.querySelectorAll("[data-painel-perfil]").forEach((painel) => {
        painel.hidden = painel.dataset.painelPerfil !== aba.dataset.abaPerfil;
      });
    });
  });
}