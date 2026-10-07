// Cada nível combina uma foto real local da pasta "fotos real" com uma imagem de IA.
const levels = [
  { imageA: "assets/real/nivel-1-real.jpg", imageB: "https://picsum.photos/seed/cyberecho-ai-1/1200/800", real: "A", fact: "A imagem A é uma fotografia real da coleção do CyberEcho. Compare iluminação, texturas e objetos pequenos para reconhecer sinais artificiais." },
  { imageA: "https://picsum.photos/seed/cyberecho-ai-2/1200/800", imageB: "assets/real/nivel-2-real.jpg", real: "B", fact: "A imagem B é uma fotografia real da coleção do CyberEcho. Em cenas sintéticas, observe detalhes repetidos e contornos incoerentes." },
  { imageA: "assets/real/nivel-3-real.jpg", imageB: "https://picsum.photos/seed/cyberecho-ai-3/1200/800", real: "A", fact: "A imagem A é real. Texturas naturais e a relação entre luz, sombras e profundidade dão boas pistas." },
  { imageA: "https://picsum.photos/seed/cyberecho-ai-4/1200/800", imageB: "assets/real/nivel-4-real.webp", real: "B", fact: "A imagem B é real. Em paisagens urbanas artificiais, linhas, placas e elementos ao fundo costumam denunciar falhas." },
  { imageA: "assets/real/nivel-5-real.jpg", imageB: "https://picsum.photos/seed/cyberecho-ai-5/1200/800", real: "A", fact: "A imagem A é real. Observe padrões, proporções e cores excessivamente uniformes ao analisar a imagem de IA." },
  { imageA: "https://picsum.photos/seed/cyberecho-ai-6/1200/800", imageB: "assets/real/nivel-6-real.jpg", real: "B", fact: "A imagem B é real. Olhe com atenção para detalhes pequenos: eles normalmente revelam a origem de uma imagem." }
];

const els = {
  game: document.querySelector("#game-screen"), final: document.querySelector("#final-screen"),
  level: document.querySelector("#level-indicator"), score: document.querySelector("#score-indicator"),
  progress: document.querySelector("#progress-bar"), imageA: document.querySelector("#image-a"), imageB: document.querySelector("#image-b"),
  cards: [...document.querySelectorAll(".image-card")], feedback: document.querySelector("#feedback"),
  feedbackIcon: document.querySelector("#feedback-icon"), feedbackTitle: document.querySelector("#feedback-title"), feedbackText: document.querySelector("#feedback-text"),
  hint: document.querySelector("#hint"), next: document.querySelector("#next-button"),
  finalScore: document.querySelector("#final-score"), finalTitle: document.querySelector("#final-title"), finalMessage: document.querySelector("#final-message"), restart: document.querySelector("#restart-button")
};
let currentLevel = 0;
let score = 0;
let answered = false;

function renderLevel() {
  const level = levels[currentLevel];
  answered = false;
  els.level.textContent = `${currentLevel + 1} de ${levels.length}`;
  els.score.textContent = score;
  els.progress.style.width = `${((currentLevel + 1) / levels.length) * 100}%`;
  els.imageA.src = level.imageA;
  els.imageB.src = level.imageB;
  els.feedback.hidden = true;
  els.next.hidden = true;
  els.hint.textContent = "Clique em uma imagem para dar seu palpite.";
  els.cards.forEach(card => { card.disabled = false; card.className = "image-card"; card.querySelector(".result-badge").textContent = ""; });
}

function choose(choice) {
  if (answered) return;
  answered = true;
  const level = levels[currentLevel];
  const won = choice === level.real;
  if (won) score += 1;
  els.score.textContent = score;
  els.cards.forEach(card => {
    const letter = card.dataset.choice;
    const isReal = letter === level.real;
    card.disabled = true;
    card.classList.add(isReal ? "is-real" : "is-ai");
    card.querySelector(".result-badge").textContent = isReal ? "✓ REAL" : "✕ IA";
  });
  els.feedback.hidden = false;
  els.feedbackIcon.className = `feedback-icon ${won ? "good" : "bad"}`;
  els.feedbackIcon.textContent = won ? "✓" : "!";
  els.feedbackTitle.textContent = won ? "Boa! Você acertou." : "Quase! Esta não era a imagem real.";
  els.feedbackText.textContent = level.fact;
  els.hint.textContent = won ? "Seu radar visual está afiado." : "O detalhe faz toda a diferença.";
  els.next.hidden = false;
  els.next.innerHTML = currentLevel === levels.length - 1 ? "Ver resultado <span>→</span>" : "Próximo nível <span>→</span>";
}

function showFinal() {
  els.game.hidden = true;
  els.final.hidden = false;
  els.finalScore.textContent = score;
  const messages = [
    ["Continue observando!", "A prática treina o olhar. Tente novamente e compare os pequenos detalhes."],
    ["Bom faro visual!", "Você já percebeu vários sinais. Mais uma rodada pode transformar suspeitas em certezas."],
    ["Olho clínico de especialista!", "Você acertou a maioria dos desafios e sabe onde procurar as pistas."],
    ["Impressionante. Você é difícil de enganar!", "Uma rodada perfeita: seu olhar passou por todos os testes."]
  ];
  const result = messages[score <= 1 ? 0 : score <= 3 ? 1 : score <= 5 ? 2 : 3];
  els.finalTitle.textContent = result[0]; els.finalMessage.textContent = result[1];
}

function nextLevel() { if (currentLevel === levels.length - 1) showFinal(); else { currentLevel += 1; renderLevel(); window.scrollTo({ top: 0, behavior: "smooth" }); } }
function restart() { currentLevel = 0; score = 0; els.final.hidden = true; els.game.hidden = false; renderLevel(); }

els.cards.forEach(card => card.addEventListener("click", () => choose(card.dataset.choice)));
els.next.addEventListener("click", nextLevel);
els.restart.addEventListener("click", restart);
document.querySelector(".brand").addEventListener("click", event => { event.preventDefault(); restart(); });
renderLevel();
