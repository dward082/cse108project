const ANSWERS = [
  "ABOUT",
  "ACORN",
  "ADAPT",
  "AGILE",
  "ALERT",
  "ALIEN",
  "ALIVE",
  "AMBER",
  "APPLE",
  "ARMOR",
  // "ARROW",
  // "BASIC",
  // "BATCH",
  // "BEACH",
  // "BEARD",
  // "BENCH",
  // "BLADE",
  // "BLEND",
  // "BLOOM",
  // "BOARD",
  // "BRAIN",
  // "BRAVE",
  // "BRICK",
  // "BRING",
  // "BROAD",
  // "CABLE",
  // "CANDY",
  // "CARRY",
  // "CHAIN",
  // "CHAIR",
  // "CHARM",
  // "CHESS",
  // "CIVIC",
  // "CLEAR",
  // "CLOUD",
  // "COAST",
  // "CORAL",
  // "CRANE",
  // "CRISP",
  // "CROWN",
  // "DAILY",
  // "DAIRY",
  // "DANCE",
  // "DELTA",
  // "DREAM",
  // "DRIFT",
  // "EAGER",
  // "EARTH",
  // "ELBOW",
  // "ELDER",
  // "ENTRY",
  // "FAITH",
  // "FANCY",
  // "FIELD",
  // "FLAME",
  // "FLEET",
  // "FLOUR",
  // "FOCUS",
  // "FORGE",
  // "FRAME",
  // "FRESH",
  // "FRONT",
  // "GIANT",
  // "GLASS",
  // "GLOBE",
  // "GRACE",
  // "GRADE",
  // "GRAND",
  // "GRAPE",
  // "GREEN",
  // "GUARD",
  // "HAPPY",
  // "HEART",
  // "HONEY",
  // "HORSE",
  // "HOUSE",
  // "HUMAN",
  // "IDEAL",
  // "IMAGE",
  // "INDEX",
  // "INNER",
  // "IVORY",
  // "JELLY",
  // "JOLLY",
  // "JUDGE",
  // "JUICE",
  // "KNIFE",
  // "LASER",
  // "LAYER",
  // "LEMON",
  // "LIGHT",
  // "LIMIT",
  // "LODGE",
  // "MAGIC",
  // "MAJOR",
  // "MANGO",
  // "MAPLE",
  // "MARCH",
  // "MATCH",
  // "MERCY",
  // "METAL",
  // "MIGHT",
  // "MODEL",
  // "MONEY",
  // "MONTH",
  // "MOTOR",
  // "MUSIC",
  // "NERVE",
  // "NIGHT",
  // "NOBLE",
  // "NORTH",
  // "NOVEL",
  // "OCEAN",
  // "OLIVE",
  // "ONION",
  // "ORBIT",
  // "OTHER",
  // "PAINT",
  // "PANEL",
  // "PAPER",
  // "PARTY",
  // "PEACE",
  // "PEARL",
  // "PIANO",
  // "PILOT",
  // "PLANT",
  // "PLATE",
  // "POINT",
  // "PRIDE",
  // "PRIME",
  // "PRIZE",
  // "QUEEN",
  // "QUICK",
  // "QUIET",
  // "RADAR",
  // "RADIO",
  // "RANCH",
  // "REACH",
  // "READY",
  // "RIVER",
  // "ROAST",
  // "ROBIN",
  // "ROUND",
  // "ROYAL",
  // "SALAD",
  // "SCALE",
  // "SCENE",
  // "SCOPE",
  // "SHARE",
  // "SHARP",
  // "SHELF",
  // "SHINE",
  // "SKILL",
  // "SMART",
  // "SMILE",
  // "SOLAR",
  // "SOLID",
  // "SOUND",
  // "SPACE",
  // "SPARK",
  // "SPEED",
  // "SPICE",
  // "STAGE",
  // "STAND",
  // "STEAM",
  // "STONE",
  // "STORM",
  // "STORY",
  // "SUGAR",
  // "SUPER",
  // "SWEET",
  // "TABLE",
  // "TEACH",
  // "TIGER",
  // "TIMER",
  // "TOAST",
  // "TOWER",
  // "TRACE",
  // "TRAIL",
  // "TRAIN",
  // "TRUST",
  // "UNION",
  // "UNITY",
  // "VALUE",
  // "VIDEO",
  // "VOICE",
  // "WATER",
  // "WHEEL",
  // "WHOLE",
  // "WORLD",
  // "WORTH",
  // "YEAST",
  // "YOUNG",
  // "ZEBRA",
];

const STORAGE_KEYS = {
  player: "wordle.player",
};

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const MATCH_ROUNDS = 3;
const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const STATUS_RANK = { absent: 1, present: 2, correct: 3 };
const CONFETTI_COLORS = ["#3fa66d", "#d5a93d", "#6ca6df", "#df6258", "#edf2f7"];
const SERVER_USER = window.WORDLE_USER || {
  id: null,
  username: "Player",
  role: "player",
  isAdmin: false,
};

let lastAnswer = "";
let socket = null;
let livePlayerIndex = null;
let confettiAnimation = 0;
let confettiPieces = [];

const dom = {
  confettiLayer: document.querySelector("#confettiLayer"),
  appShell: document.querySelector("#appShell"),
  sessionRole: document.querySelector("#sessionRole"),
  headline: document.querySelector("#headline"),
  tabs: document.querySelectorAll(".tab"),
  screens: document.querySelectorAll(".screen"),
  summaryCurrent: document.querySelector("#summaryCurrent"),
  summaryBest: document.querySelector("#summaryBest"),
  playerName: document.querySelector("#playerName"),
  accountUsername: document.querySelector("#accountUsername"),
  saveUsername: document.querySelector("#saveUsername"),
  currentPassword: document.querySelector("#currentPassword"),
  profileNewPassword: document.querySelector("#profileNewPassword"),
  saveProfilePassword: document.querySelector("#saveProfilePassword"),
  playerBestStreak: document.querySelector("#playerBestStreak"),
  playerWordsGuessed: document.querySelector("#playerWordsGuessed"),
  playerMessage: document.querySelector("#playerMessage"),
  passwordMessage: document.querySelector("#passwordMessage"),
  streakWords: document.querySelector("#streakWords"),
  streakGuesses: document.querySelector("#streakGuesses"),
  streakRound: document.querySelector("#streakRound"),
  streakPrompt: document.querySelector("#streakPrompt"),
  streakStatus: document.querySelector("#streakStatus"),
  streakBoard: document.querySelector("#streakBoard"),
  streakKeyboard: document.querySelector("#streakKeyboard"),
  restartStreak: document.querySelector("#restartStreak"),
  playerOneName: document.querySelector("#playerOneName"),
  playerTwoName: document.querySelector("#playerTwoName"),
  startChallenge: document.querySelector("#startChallenge"),
  leaveChallenge: document.querySelector("#leaveChallenge"),
  p1Label: document.querySelector("#p1Label"),
  p2Label: document.querySelector("#p2Label"),
  p1Score: document.querySelector("#p1Score"),
  p2Score: document.querySelector("#p2Score"),
  roundLog: document.querySelector("#roundLog"),
  multiRound: document.querySelector("#multiRound"),
  multiPrompt: document.querySelector("#multiPrompt"),
  multiStatus: document.querySelector("#multiStatus"),
  multiBoard: document.querySelector("#multiBoard"),
  opponentBoard: document.querySelector("#opponentBoard"),
  multiKeyboard: document.querySelector("#multiKeyboard"),
  multiCover: document.querySelector("#multiCover"),
  coverTitle: document.querySelector("#coverTitle"),
  coverText: document.querySelector("#coverText"),
  coverAction: document.querySelector("#coverAction"),
  coverActionText: document.querySelector("#coverActionText"),
  streakLeaders: document.querySelector("#streakLeaders"),
  adminTools: document.querySelector("#adminTools"),
  passwordPlayer: document.querySelector("#passwordPlayer"),
  newPlayerPassword: document.querySelector("#newPlayerPassword"),
  savePlayerPassword: document.querySelector("#savePlayerPassword"),
  deletePlayerSelect: document.querySelector("#deletePlayerSelect"),
  deletePlayerButton: document.querySelector("#deletePlayerButton"),
  adminMessage: document.querySelector("#adminMessage"),
};

const state = {
  auth: {
    id: SERVER_USER.id,
    username: SERVER_USER.username,
    role: SERVER_USER.role,
    isAdmin: Boolean(SERVER_USER.isAdmin),
  },
  adminPlayers: [],
  leaders: [],
  userWords: 0,
  userBest: 0,
  screen: SERVER_USER.isAdmin ? "leaderboard" : "streak",
  streak: createStreakState(),
  multi: createMultiState(),
};

function createStreakState() {
  return {
    answer: pickAnswer(),
    current: "",
    guesses: [],
    keys: {},
    score: 0,
    round: 1,
    locked: false,
    over: false,
    status: "Ready",
  };
}

function createMultiState() {
  return {
    code: "",
    phase: "lobby",
    players: [],
    names: ["Player 1", "Player 2"],
    scores: [0, 0],
    round: 1,
    turns: [createTurn(), createTurn()],
    history: [],
    status: "Create or join a room",
    pending: "start",
    current: "",
    connected: false,
  };
}

function createTurn() {
  return {
    current: "",
    guesses: [],
    keys: {},
    start: 0,
    seconds: 0,
    solved: false,
    saved: false,
    finished: false,
    locked: false,
  };
}

function pickAnswer() {
  let answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
  if (ANSWERS.length > 1) {
    while (answer === lastAnswer) {
      answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    }
  }
  return answer;
}

function cleanName(value, fallback) {
  const name = value.trim().replace(/\s+/g, " ");
  return name ? name.slice(0, 18) : fallback;
}

function applyUserDefaults() {
  const fallback = state.auth.isAdmin ? "Admin" : state.auth.username;
  const name = fallback;
  dom.playerName.value = name;
  dom.accountUsername.value = state.auth.username;
  dom.playerOneName.value = state.auth.username;
  dom.playerOneName.readOnly = true;
  dom.playerTwoName.placeholder = "Leave blank to create";
}

function updateSessionUi() {
  dom.sessionRole.textContent = state.auth.isAdmin ? "Admin" : state.auth.username;
  dom.adminTools.hidden = !state.auth.isAdmin;
}

function syncCurrentUser(currentUser) {
  if (!currentUser) return;
  state.auth.id = currentUser.user_id || state.auth.id;
  state.auth.username = currentUser.username || state.auth.username;
  if (Object.hasOwn(currentUser, "words")) {
    state.userWords = currentUser.words || 0;
  }
  if (Object.hasOwn(currentUser, "bestScore")) {
    state.userBest = currentUser.bestScore || 0;
  }
  dom.playerName.value = state.auth.username;
  dom.accountUsername.value = state.auth.username;
}

async function adminRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Admin request failed");
  }
  return payload;
}

async function appRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

async function loadLeaderboard() {
  try {
    const payload = await appRequest("/api/leaderboard");
    state.leaders = payload.leaders || [];
    syncCurrentUser(payload.currentUser);
    updateSessionUi();
    renderSummary();
    renderProfileStats();
    renderLeaderboards();
  } catch (error) {
    state.leaders = [];
    state.userWords = 0;
    state.userBest = 0;
    renderSummary();
    renderProfileStats();
    renderLeaderboards();
  }
}

async function saveProfileUsername() {
  if (state.auth.isAdmin) return;
  const username = cleanName(dom.accountUsername.value, state.auth.username);

  if (!username) {
    dom.playerMessage.textContent = "Enter a username.";
    dom.accountUsername.focus();
    return;
  }

  try {
    const payload = await appRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify({ username }),
    });
    syncCurrentUser(payload.currentUser);
    dom.playerOneName.value = state.auth.username;
    localStorage.setItem(STORAGE_KEYS.player, state.auth.username);
    dom.playerMessage.textContent = payload.message;
    await loadLeaderboard();
    render();
  } catch (error) {
    dom.playerMessage.textContent = error.message;
  }
}

async function saveProfilePassword() {
  if (state.auth.isAdmin) return;
  const currentPassword = dom.currentPassword.value;
  const newPassword = dom.profileNewPassword.value;

  if (!currentPassword || !newPassword) {
    dom.passwordMessage.textContent = "Enter your current and new password.";
    if (!currentPassword) {
      dom.currentPassword.focus();
    } else {
      dom.profileNewPassword.focus();
    }
    return;
  }

  try {
    const payload = await appRequest("/api/profile/password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    dom.currentPassword.value = "";
    dom.profileNewPassword.value = "";
    dom.passwordMessage.textContent = payload.message;
  } catch (error) {
    dom.passwordMessage.textContent = error.message;
  }
}

async function loadAdminPlayers() {
  if (!state.auth.isAdmin) return;

  try {
    const payload = await adminRequest("/api/admin/players");
    state.adminPlayers = payload.players || [];
    renderAdminPlayerOptions(state.adminPlayers);
  } catch (error) {
    dom.adminMessage.textContent = error.message;
  }
}

async function saveSelectedPlayerPassword() {
  if (!state.auth.isAdmin) return;
  const userId = Number(dom.passwordPlayer.value);
  const password = dom.newPlayerPassword.value.trim();

  if (!userId) {
    dom.adminMessage.textContent = "Choose a player.";
    return;
  }

  if (!password) {
    dom.adminMessage.textContent = "Enter a new password.";
    dom.newPlayerPassword.focus();
    return;
  }

  try {
    const payload = await adminRequest(`/api/admin/players/${userId}/password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    dom.newPlayerPassword.value = "";
    dom.adminMessage.textContent = payload.message;
  } catch (error) {
    dom.adminMessage.textContent = error.message;
  }
}

async function deleteSelectedPlayer() {
  if (!state.auth.isAdmin) return;
  const userId = Number(dom.deletePlayerSelect.value);
  const player = state.adminPlayers.find((item) => item.id === userId);

  if (!player) {
    dom.adminMessage.textContent = "Choose a player to delete.";
    return;
  }

  const confirmed = window.confirm(`Delete ${player.username}?`);
  if (!confirmed) return;

  try {
    const payload = await adminRequest(`/api/admin/players/${userId}`, {
      method: "DELETE",
    });
    if ((localStorage.getItem(STORAGE_KEYS.player) || "").toLowerCase() === player.username.toLowerCase()) {
      localStorage.removeItem(STORAGE_KEYS.player);
    }
    dom.adminMessage.textContent = payload.message;
    await loadAdminPlayers();
    await loadLeaderboard();
    render();
  } catch (error) {
    dom.adminMessage.textContent = error.message;
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function evaluateGuess(guess, answer) {
  const result = Array(WORD_LENGTH).fill("absent");
  const pool = answer.split("");

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = "correct";
      pool[index] = "";
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (result[index] === "correct") continue;
    const matchIndex = pool.indexOf(guess[index]);
    if (matchIndex >= 0) {
      result[index] = "present";
      pool[matchIndex] = "";
    }
  }

  return result;
}

function mergeKeyState(keys, guess, result) {
  guess.split("").forEach((letter, index) => {
    const next = result[index];
    const current = keys[letter];
    if (!current || STATUS_RANK[next] > STATUS_RANK[current]) {
      keys[letter] = next;
    }
  });
}

function launchConfetti({ bursts = 1, originX = 0.5, intensity = 1 } = {}) {
  if (!dom.confettiLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = dom.confettiLayer;
  const context = canvas.getContext("2d");
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  for (let burst = 0; burst < bursts; burst += 1) {
    const count = Math.round(70 * intensity);
    const startX = width * (originX + (Math.random() - 0.5) * 0.18);
    const startY = height * (0.18 + Math.random() * 0.16);

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 7 * intensity;
      confettiPieces.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 5 + Math.random() * 7,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 80 + Math.random() * 45,
      });
    }
  }

  if (!confettiAnimation) {
    confettiAnimation = window.requestAnimationFrame(drawConfetti);
  }
}

function drawConfetti() {
  const canvas = dom.confettiLayer;
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  context.clearRect(0, 0, width, height);

  confettiPieces = confettiPieces.filter((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.18;
    piece.vx *= 0.985;
    piece.rotation += piece.spin;
    piece.life -= 1;

    context.save();
    context.translate(piece.x, piece.y);
    context.rotate(piece.rotation);
    context.globalAlpha = Math.max(0, Math.min(1, piece.life / 35));
    context.fillStyle = piece.color;
    context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
    context.restore();

    return piece.life > 0 && piece.y < height + 40;
  });

  if (confettiPieces.length) {
    confettiAnimation = window.requestAnimationFrame(drawConfetti);
  } else {
    confettiAnimation = 0;
    context.clearRect(0, 0, width, height);
  }
}

function renderBoard(container, guesses, current, answer, options = {}) {
  const hideLetters = Boolean(options.hideLetters);
  const totalCells = MAX_GUESSES * WORD_LENGTH;
  if (container.children.length !== totalCells) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < totalCells; index += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      fragment.append(cell);
    }
    container.replaceChildren(fragment);
  }

  for (let row = 0; row < MAX_GUESSES; row += 1) {
    const submitted = guesses[row];
    const submittedWord = typeof submitted === "string" ? submitted : submitted?.word;
    const submittedResult = typeof submitted === "string" ? null : submitted?.result;
    const draft = row === guesses.length ? current : "";
    const letters = (submittedWord || draft).padEnd(WORD_LENGTH, " ").split("");
    const result = submittedWord ? submittedResult || evaluateGuess(submittedWord, answer) : [];

    for (let column = 0; column < WORD_LENGTH; column += 1) {
      const cell = container.children[row * WORD_LENGTH + column];
      cell.textContent = "";
      cell.style.removeProperty("--reveal-delay");
      cell.classList.remove("filled", "correct", "present", "absent");
      if (!submitted) {
        cell.classList.remove("revealed");
      }

      const letter = letters[column].trim();
      if (letter) {
        cell.textContent = hideLetters ? "" : letter;
        cell.classList.add("filled");
      }
      if (submittedWord) {
        cell.classList.add(result[column]);
        if (!cell.classList.contains("revealed")) {
          cell.classList.add("revealed");
        }
        cell.style.setProperty("--reveal-delay", `${column * 90}ms`);
      }
    }
  }
}

function renderKeyboard(container, keys) {
  const fragment = document.createDocumentFragment();

  KEY_ROWS.forEach((letters, rowIndex) => {
    const row = document.createElement("div");
    row.className = "key-row";

    if (rowIndex === 2) {
      row.append(createKey("ENTER", "Enter", true));
    }

    letters.split("").forEach((letter) => {
      row.append(createKey(letter, letter, false, keys[letter]));
    });

    if (rowIndex === 2) {
      row.append(createKey("BACKSPACE", "Del", true));
    }

    fragment.append(row);
  });

  container.replaceChildren(fragment);
}

function createKey(value, label, wide, status) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "key";
  button.dataset.key = value;
  button.textContent = label;
  button.title = label;
  if (wide) button.classList.add("wide");
  if (status) button.classList.add(status);
  return button;
}

function setScreen(screen) {
  state.screen = screen;
  dom.tabs.forEach((tab) => {
    const isActive = tab.dataset.screen === screen;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  dom.screens.forEach((section) => {
    section.classList.toggle("is-active", section.id === `screen-${screen}`);
  });
  if (state.auth.isAdmin) {
    dom.headline.textContent = "";
  } else {
    dom.headline.textContent =
      screen === "streak"
        ? "Play singleplayer Wordle."
        : screen === "multiplayer"
          ? "Play a 3-round challenge."
          : screen === "profile"
            ? "Manage your player account."
            : "Track every local record.";
  }
  render();
}

function render() {
  updateSessionUi();
  renderSummary();
  renderProfileStats();
  renderStreak();
  renderMulti();
  renderLeaderboards();
}

function renderSummary() {
  dom.summaryCurrent.textContent = state.streak.score;
  dom.summaryBest.textContent = state.userWords;
}

function renderProfileStats() {
  dom.playerBestStreak.textContent = state.userBest;
  dom.playerWordsGuessed.textContent = state.userWords;
}

function renderStreak() {
  const game = state.streak;
  dom.streakWords.textContent = game.score;
  dom.streakGuesses.textContent = `${game.guesses.length}/6`;
  dom.streakRound.textContent = `Word ${game.round}`;
  dom.streakStatus.textContent = game.status;
  dom.streakPrompt.textContent = game.over ? `Answer: ${game.answer}` : "Guess the word";
  renderBoard(dom.streakBoard, game.guesses, game.current, game.answer);
  renderKeyboard(dom.streakKeyboard, game.keys);
}

function renderMulti() {
  const match = state.multi;
  const ownIndex = livePlayerIndex ?? 0;
  const opponentIndex = ownIndex === 0 ? 1 : 0;
  const ownTurn = match.turns[ownIndex] || createTurn();
  const opponentTurn = match.turns[opponentIndex] || createTurn();

  dom.p1Label.textContent = match.names[0];
  dom.p2Label.textContent = match.names[1];
  dom.p1Score.textContent = match.scores[0];
  dom.p2Score.textContent = match.scores[1];
  dom.leaveChallenge.hidden = !match.connected && match.status !== "Connecting";
  dom.multiRound.textContent = `Round ${match.round}`;
  dom.multiPrompt.textContent =
    match.phase === "playing" ? "Your board" : "challenge";
  dom.multiStatus.textContent = getMultiStatus();
  dom.roundLog.replaceChildren(...match.history.map(createRoundLogItem));

  const shouldShowBoard = match.phase === "playing";
  renderBoard(
    dom.multiBoard,
    shouldShowBoard ? ownTurn.guesses : [],
    shouldShowBoard ? match.current : "",
    "",
  );
  renderBoard(
    dom.opponentBoard,
    shouldShowBoard ? opponentTurn.guesses : [],
    "",
    "",
    { hideLetters: true },
  );
  renderKeyboard(dom.multiKeyboard, shouldShowBoard ? ownTurn.keys : {});
  renderCover();
}

function getMultiStatus() {
  const match = state.multi;
  if (match.phase !== "playing") return match.status;
  const ownIndex = livePlayerIndex ?? 0;
  const ownTurn = match.turns[ownIndex] || createTurn();
  const opponentIndex = ownIndex === 0 ? 1 : 0;
  const opponentTurn = match.turns[opponentIndex] || createTurn();
  return `You ${ownTurn.guesses.length}/6 | Rival ${opponentTurn.guesses.length}/6`;
}

function createRoundLogItem(item) {
  const li = document.createElement("li");
  li.textContent = item.winner == null
    ? `Round ${item.round} no point`
    : `Round ${item.round} ${state.multi.names[item.winner]} won`;
  return li;
}

function formatTurnSummary(turn) {
  if (!turn.finished) return "skipped";
  return turn.solved ? `${turn.guesses} in ${turn.seconds}s` : "missed";
}

function renderCover() {
  const match = state.multi;
  const visible = match.phase !== "playing";
  dom.multiCover.classList.toggle("is-visible", visible);
  if (!visible) return;

  dom.coverAction.hidden = false;
  dom.coverAction.disabled = false;
  if (!match.connected) {
    dom.coverTitle.textContent = "Challenge";
    dom.coverText.textContent = "create a room or enter a room code.";
    dom.coverActionText.textContent = "Create / Join";
  } else if (match.phase === "lobby") {
    dom.coverTitle.textContent = match.code ? `Room ${match.code}` : "Lobby";
    dom.coverText.textContent =
      match.players.length < 2 ? "Share this code with player 2." : "Both players are ready.";
    dom.coverActionText.textContent = match.players.length < 2 ? "Waiting" : "Start Match";
    dom.coverAction.disabled = match.players.length < 2;
  } else if (match.phase === "result") {
    const last = match.history[match.history.length - 1];
    dom.coverTitle.textContent = last.winner == null ? "No point" : `${match.names[last.winner]} wins`;
    dom.coverText.textContent = last.winner == null ? `Word was ${last.word}` : `${match.scores[0]}-${match.scores[1]}`;
    dom.coverActionText.textContent = "Next Round";
  } else if (match.phase === "match") {
    const winner = getMatchWinner();
    dom.coverTitle.textContent =
      winner == null ? "Match tied" : `${match.names[winner]} wins the match`;
    dom.coverText.textContent = `${match.scores[0]}-${match.scores[1]}`;
    dom.coverActionText.textContent = "Rematch";
  }

  if (match.phase !== "lobby") {
    dom.coverAction.disabled = false;
  }
}

function renderLeaderboards() {
  dom.streakLeaders.replaceChildren(...renderStreakRows(state.leaders));
  renderAdminPlayerOptions(state.adminPlayers);
}

function renderStreakRows(rows) {
  if (!rows.length) return [emptyRow(3, "No words yet")];
  return rows.map((row, index) => {
    const tr = document.createElement("tr");
    tr.classList.toggle("current-player", row.user_id === state.auth.id);
    tr.innerHTML = `
      <td>${row.rank || index + 1}</td>
      <td>${escapeHtml(row.username)}</td>
      <td>${row.words}</td>
    `;
    return tr;
  });
}

function renderAdminPlayerOptions(players) {
  if (!state.auth.isAdmin) return;

  const currentPasswordValue = dom.passwordPlayer.value;
  const currentDeleteValue = dom.deletePlayerSelect.value;
  const passwordOptions = [];
  const deleteOptions = [];

  if (!players.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No players yet";
    passwordOptions.push(option);
    deleteOptions.push(option.cloneNode(true));
  } else {
    players.forEach((player) => {
      const passwordOption = document.createElement("option");
      passwordOption.value = player.id;
      passwordOption.textContent = player.username;
      passwordOptions.push(passwordOption);

      const deleteOption = document.createElement("option");
      deleteOption.value = player.id;
      deleteOption.textContent = player.username;
      deleteOptions.push(deleteOption);
    });
  }

  dom.passwordPlayer.replaceChildren(...passwordOptions);
  dom.deletePlayerSelect.replaceChildren(...deleteOptions);

  if (players.some((player) => String(player.id) === currentPasswordValue)) {
    dom.passwordPlayer.value = currentPasswordValue;
  }
  if (players.some((player) => String(player.id) === currentDeleteValue)) {
    dom.deletePlayerSelect.value = currentDeleteValue;
  }
}

function emptyRow(columns, text) {
  const tr = document.createElement("tr");
  tr.className = "empty-row";
  const td = document.createElement("td");
  td.colSpan = columns;
  td.textContent = text;
  tr.append(td);
  return tr;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function handleInput(key) {
  if (!state.auth.role) return;
  if (state.screen === "streak") {
    handleStreakInput(key);
  } else if (state.screen === "multiplayer") {
    handleMultiInput(key);
  }
}

function normalizeKey(event) {
  if (event.key === "Enter") return "ENTER";
  if (event.key === "Backspace") return "BACKSPACE";
  if (/^[a-zA-Z]$/.test(event.key)) return event.key.toUpperCase();
  return "";
}

function handleStreakInput(key) {
  const game = state.streak;
  if (game.locked || game.over) return;

  if (key === "BACKSPACE") {
    game.current = game.current.slice(0, -1);
  } else if (key === "ENTER") {
    submitStreakGuess();
  } else if (/^[A-Z]$/.test(key) && game.current.length < WORD_LENGTH) {
    game.current += key;
  }

  render();
}

function submitStreakGuess() {
  const game = state.streak;
  if (game.current.length !== WORD_LENGTH) {
    game.status = "Five letters";
    return;
  }

  const guess = game.current;
  const result = evaluateGuess(guess, game.answer);
  game.guesses.push(guess);
  game.current = "";
  mergeKeyState(game.keys, guess, result);

  if (guess === game.answer) {
    game.score += 1;
    game.status = "Correct";
    game.locked = true;
    recordSingleplayerCorrect(game.answer);
    render();
    launchConfetti({ bursts: 1, intensity: 1 });
    window.setTimeout(nextStreakWord, 850);
    return;
  }

  if (game.guesses.length >= MAX_GUESSES) {
    game.status = "Run ended";
    game.over = true;
    game.locked = true;
    localStorage.setItem(STORAGE_KEYS.player, cleanName(dom.playerName.value, "Player"));
  } else {
    game.status = "Try again";
  }
}

function nextStreakWord() {
  lastAnswer = state.streak.answer;
  state.streak.answer = pickAnswer();
  state.streak.current = "";
  state.streak.guesses = [];
  state.streak.keys = {};
  state.streak.round += 1;
  state.streak.locked = false;
  state.streak.status = "Next word";
  render();
}

function restartStreak() {
  const name = cleanName(dom.playerName.value, "Player");
  dom.playerName.value = name;
  localStorage.setItem(STORAGE_KEYS.player, name);
  lastAnswer = state.streak.answer;
  state.streak = createStreakState();
  render();
}

async function recordSingleplayerCorrect(answer) {
  const name = cleanName(dom.playerName.value, "Player");
  dom.playerName.value = name;
  localStorage.setItem(STORAGE_KEYS.player, name);

  try {
    await appRequest("/api/game-records", {
      method: "POST",
      body: JSON.stringify({
        score: state.streak.score,
        solvedWord: answer,
      }),
    });
    await loadLeaderboard();
  } catch (error) {
    state.streak.status = "Could not save";
    render();
  }
}

function startChallenge() {
  ensureSocket();
  const roomCode = dom.playerTwoName.value.trim().toUpperCase();
  state.multi.status = "Connecting";
  state.multi.connected = true;
  socket.emit("join_match", { roomCode });
  render();
}

function leaveChallenge() {
  if (socket?.connected) {
    socket.emit("leave_match");
    socket.disconnect();
  }
  socket = null;
  livePlayerIndex = null;
  state.multi = createMultiState();
  dom.playerTwoName.value = "";
  dom.startChallenge.querySelector("span").textContent = "Create / Join";
  render();
}

function handleMultiInput(key) {
  const match = state.multi;
  if (match.phase !== "playing") return;
  const turn = match.turns[livePlayerIndex ?? 0] || createTurn();
  if (turn.finished) return;

  if (key === "BACKSPACE") {
    match.current = match.current.slice(0, -1);
  } else if (key === "ENTER") {
    submitMultiGuess();
  } else if (/^[A-Z]$/.test(key) && match.current.length < WORD_LENGTH) {
    match.current += key;
  }

  render();
}

function submitMultiGuess() {
  const match = state.multi;
  if (match.current.length !== WORD_LENGTH) {
    match.status = "Five letters";
    render();
    return;
  }

  socket.emit("submit_guess", { guess: match.current });
  match.current = "";
  render();
}

function getMatchWinner() {
  const { scores } = state.multi;
  if (scores[0] === scores[1]) return null;
  return scores[0] > scores[1] ? 0 : 1;
}

function summarizeTurn(turn) {
  return {
    finished: turn.finished,
    solved: turn.solved,
    guesses: turn.guesses.length,
    seconds: turn.seconds,
  };
}

function compareTurns(p1, p2) {
  if (p1.solved && !p2.solved) return 0;
  if (!p1.solved && p2.solved) return 1;
  if (!p1.solved && !p2.solved) return null;
  if (p1.guesses !== p2.guesses) return p1.guesses < p2.guesses ? 0 : 1;
  if (p1.seconds !== p2.seconds) return p1.seconds < p2.seconds ? 0 : 1;
  return null;
}

function beginMultiTurn() {
  ensureSocket();
  socket.emit("start_match");
}

function handleCoverAction() {
  const match = state.multi;
  if (!match.connected) {
    startChallenge();
  } else if (match.phase === "lobby") {
    beginMultiTurn();
  } else if (match.phase === "result") {
    socket.emit("next_round");
  } else if (match.phase === "match") {
    socket.emit("next_round");
  }
}

function ensureSocket() {
  if (socket) return;
  socket = io({
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    state.multi.status = "Connected";
    render();
  });

  socket.on("disconnect", () => {
    state.multi.connected = false;
    if (state.screen === "multiplayer") {
      state.multi.status = "Disconnected";
    }
    render();
  });

  socket.on("joined_match", (payload) => {
    livePlayerIndex = payload.playerIndex;
    state.multi.code = payload.roomCode;
    state.multi.connected = true;
    dom.playerTwoName.value = payload.roomCode;
    dom.startChallenge.querySelector("span").textContent = "Rejoin Room";
    render();
  });

  socket.on("match_state", (payload) => {
    applyLiveMatchState(payload);
    render();
    if (payload.phase === "result") {
      loadLeaderboard();
    }
    if (payload.phase === "match" && getMatchWinner() === livePlayerIndex) {
      launchConfetti({ bursts: 2, intensity: 1.2 });
    }
  });

  socket.on("match_error", (payload) => {
    state.multi.status = payload.message || "Match error";
    state.multi.connected = Boolean(socket?.connected);
    render();
  });
}

function applyLiveMatchState(payload) {
  const names = ["Waiting", "Waiting"];
  (payload.players || []).forEach((player, index) => {
    names[index] = player.username;
  });

  state.multi.code = payload.code || state.multi.code;
  state.multi.connected = true;
  state.multi.players = payload.players || [];
  state.multi.names = names;
  state.multi.scores = payload.scores || [0, 0];
  state.multi.round = payload.round || 1;
  state.multi.phase = payload.phase || "lobby";
  state.multi.turns = payload.turns || [createTurn(), createTurn()];
  state.multi.history = payload.history || [];
  state.multi.status = payload.status || "Ready";
}

function wireEvents() {
  dom.savePlayerPassword.addEventListener("click", saveSelectedPlayerPassword);
  dom.deletePlayerButton.addEventListener("click", deleteSelectedPlayer);
  dom.saveUsername.addEventListener("click", saveProfileUsername);
  dom.saveProfilePassword.addEventListener("click", saveProfilePassword);

  dom.tabs.forEach((tab) => {
    tab.addEventListener("click", () => setScreen(tab.dataset.screen));
  });

  dom.streakKeyboard.addEventListener("click", (event) => {
    const button = event.target.closest("[data-key]");
    if (button) handleInput(button.dataset.key);
  });

  dom.multiKeyboard.addEventListener("click", (event) => {
    const button = event.target.closest("[data-key]");
    if (button) handleInput(button.dataset.key);
  });

  dom.restartStreak.addEventListener("click", restartStreak);
  dom.startChallenge.addEventListener("click", startChallenge);
  dom.leaveChallenge.addEventListener("click", leaveChallenge);
  dom.coverAction.addEventListener("click", handleCoverAction);

  dom.playerName.addEventListener("change", () => {
    const name = cleanName(dom.playerName.value, "Player");
    dom.playerName.value = name;
    localStorage.setItem(STORAGE_KEYS.player, name);
  });

  document.addEventListener("keydown", (event) => {
    const tagName = document.activeElement?.tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;
    const key = normalizeKey(event);
    if (!key) return;
    event.preventDefault();
    handleInput(key);
  });
}

function boot() {
  applyUserDefaults();
  wireEvents();
  render();
  loadAdminPlayers();
  loadLeaderboard();
  window.setInterval(() => {
    if (state.multi.phase === "playing") {
      dom.multiStatus.textContent = getMultiStatus();
    }
  }, 500);
}

boot();
