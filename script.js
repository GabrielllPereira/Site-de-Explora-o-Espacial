const $ = (selector, root = document) => root.querySelector(selector);

function parsePtNumber(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;

  // Aceita:
  // - "10" / "10,5" / "10.5"
  // - "1.000,5" (pt-BR com milhar por ponto)
  const compact = trimmed.replace(/\s+/g, "");
  const normalized =
    compact.includes(",") && compact.includes(".")
      ? compact.replace(/\./g, "").replace(/,/g, ".")
      : compact.replace(/,/g, ".");
  const result = Number(normalized);
  if (!Number.isFinite(result) || result <= 0) return null;
  return result;
}

function setupMenu() {
  const button = $("[data-menu-button]");
  const menu = $("[data-menu]");
  if (!button || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  };

  button.addEventListener("click", toggleMenu);

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function setupWeightCalculator() {
  const form = $("[data-weight-form]");
  const result = $("[data-weight-result]");
  const reset = $("[data-reset]");

  if (!form || !result) return;

  const gravityRatio = {
    moon: 0.165,
    mercury: 0.378,
    venus: 0.907,
    mars: 0.377,
    jupiter: 2.36,
    saturn: 0.916,
    uranus: 0.889,
    neptune: 1.12,
  };

  const labels = {
    moon: "Lua",
    mercury: "Mercúrio",
    venus: "Vênus",
    mars: "Marte",
    jupiter: "Júpiter",
    saturn: "Saturno",
    uranus: "Urano",
    neptune: "Netuno",
  };

  const formatKg = (value) => new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const earthKg = parsePtNumber(data.get("pesoTerra"));
    const destination = String(data.get("destino"));

    if (!earthKg) {
      result.textContent = "Digite um peso válido (ex.: 65).";
      return;
    }

    const ratio = gravityRatio[destination];
    if (!ratio) {
      result.textContent = "Escolha um destino válido.";
      return;
    }

    const destinationKg = earthKg * ratio;
    const name = labels[destination] ?? "destino";

    result.textContent = `Em ${name}, isso daria aproximadamente ${formatKg(destinationKg)} kg (comparado ao seu peso na Terra).`;
  });

  if (reset) {
    reset.addEventListener("click", () => {
      form.reset();
      result.textContent = "Preencha e clique em “Calcular”.";
      $("#pesoTerra")?.focus();
    });
  }
}

setupMenu();
setupWeightCalculator();
