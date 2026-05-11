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
const SERVER_USER = window.WORDLE_USER || {
  username: "Player",
  role: "player",
  isAdmin: false,
};

let lastAnswer = "";

const dom = {
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
  p1Label: document.querySelector("#p1Label"),
  p2Label: document.querySelector("#p2Label"),
  p1Score: document.querySelector("#p1Score"),
  p2Score: document.querySelector("#p2Score"),
  roundLog: document.querySelector("#roundLog"),
  multiRound: document.querySelector("#multiRound"),
  multiPrompt: document.querySelector("#multiPrompt"),
  multiStatus: document.querySelector("#multiStatus"),
  multiBoard: document.querySelector("#multiBoard"),
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
    phase: "setup",
    names: ["Player 1", "Player 2"],
    scores: [0, 0],
    round: 1,
    active: 0,
    answer: pickAnswer(),
    turns: [createTurn(), createTurn()],
    history: [],
    status: "Idle",
    pending: "start",
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
  if (state.auth.isAdmin) {
    dom.playerOneName.value = "player1";
    dom.playerTwoName.value = "player2";
  } else {
    dom.playerOneName.value = state.auth.username === "player2" ? "player1" : state.auth.username;
    dom.playerTwoName.value = state.auth.username === "player2" ? state.auth.username : "player2";
  }
}

function updateSessionUi() {
  dom.sessionRole.textContent = state.auth.isAdmin ? "Admin" : state.auth.username;
  dom.adminTools.hidden = !state.auth.isAdmin;
}

function syncCurrentUser(currentUser) {
  if (!currentUser) return;
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
    dom.playerOneName.value = state.auth.username === "player2" ? "player1" : state.auth.username;
    dom.playerTwoName.value = state.auth.username === "player2" ? state.auth.username : "player2";
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

function renderBoard(container, guesses, current, answer) {
  const fragment = document.createDocumentFragment();

  for (let row = 0; row < MAX_GUESSES; row += 1) {
    const submitted = guesses[row];
    const draft = row === guesses.length ? current : "";
    const letters = (submitted || draft).padEnd(WORD_LENGTH, " ").split("");
    const result = submitted ? evaluateGuess(submitted, answer) : [];

    for (let column = 0; column < WORD_LENGTH; column += 1) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const letter = letters[column].trim();
      if (letter) {
        cell.textContent = letter;
        cell.classList.add("filled");
      }
      if (submitted) {
        cell.classList.add(result[column]);
      }
      fragment.append(cell);
    }
  }

  container.replaceChildren(fragment);
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
  const activeTurn = match.turns[match.active];
  const activeName = match.names[match.active];

  dom.p1Label.textContent = match.names[0];
  dom.p2Label.textContent = match.names[1];
  dom.p1Score.textContent = match.scores[0];
  dom.p2Score.textContent = match.scores[1];
  dom.multiRound.textContent = `Round ${match.round}`;
  dom.multiPrompt.textContent =
    match.phase === "turn" ? `${activeName}'s word` : "Challenge board";
  dom.multiStatus.textContent = getMultiStatus();
  dom.roundLog.replaceChildren(...match.history.map(createRoundLogItem));

  const shouldShowBoard = match.phase === "turn";
  renderBoard(
    dom.multiBoard,
    shouldShowBoard ? activeTurn.guesses : [],
    shouldShowBoard ? activeTurn.current : "",
    match.answer,
  );
  renderKeyboard(dom.multiKeyboard, shouldShowBoard ? activeTurn.keys : {});
  renderCover();
}

function getMultiStatus() {
  const match = state.multi;
  if (match.phase !== "turn") return match.status;
  const turn = match.turns[match.active];
  const elapsed = Math.max(0, Math.floor((Date.now() - turn.start) / 1000));
  return `${elapsed}s`;
}

function createRoundLogItem(item) {
  const li = document.createElement("li");
  const p1 = formatTurnSummary(item.p1);
  const p2 = formatTurnSummary(item.p2);
  li.textContent = item.winner == null
    ? `Round ${item.round}: no point (${item.word})`
    : `Round ${item.round}: ${state.multi.names[item.winner]} won (${p1} vs ${p2})`;
  return li;
}

function formatTurnSummary(turn) {
  if (!turn.finished) return "skipped";
  return turn.solved ? `${turn.guesses} in ${turn.seconds}s` : "missed";
}

function renderCover() {
  const match = state.multi;
  const visible = match.phase !== "turn";
  dom.multiCover.classList.toggle("is-visible", visible);
  if (!visible) return;

  if (match.phase === "setup") {
    dom.coverTitle.textContent = "Challenge";
    dom.coverText.textContent = "Start the 3-round match.";
    dom.coverActionText.textContent = "Start Match";
  } else if (match.phase === "ready") {
    dom.coverTitle.textContent = `${match.names[match.active]} is up`;
    dom.coverText.textContent = `Round ${match.round}`;
    dom.coverActionText.textContent = "Ready";
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
}

function renderLeaderboards() {
  dom.streakLeaders.replaceChildren(...renderStreakRows(state.leaders));
  renderAdminPlayerOptions(state.adminPlayers);
}

function renderStreakRows(rows) {
  if (!rows.length) return [emptyRow(3, "No words yet")];
  return rows.map((row, index) => {
    const tr = document.createElement("tr");
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
  const p1 = cleanName(dom.playerOneName.value, "Player 1");
  const p2 = cleanName(dom.playerTwoName.value, "Player 2");
  dom.playerOneName.value = p1;
  dom.playerTwoName.value = p2;
  lastAnswer = state.multi.answer;
  state.multi = createMultiState();
  state.multi.names = [p1, p2];
  state.multi.phase = "ready";
  state.multi.status = "Ready";
  prepareMultiRound(false);
  render();
}

function prepareMultiRound(advanceRound) {
  const match = state.multi;
  if (advanceRound) match.round += 1;
  lastAnswer = match.answer;
  match.answer = pickAnswer();
  match.active = 0;
  match.turns = [createTurn(), createTurn()];
  match.phase = "ready";
  match.status = "Ready";
  match.pending = "next";
}

function handleMultiInput(key) {
  const match = state.multi;
  if (match.phase !== "turn") return;
  const turn = match.turns[match.active];
  if (turn.locked) return;

  if (key === "BACKSPACE") {
    turn.current = turn.current.slice(0, -1);
  } else if (key === "ENTER") {
    submitMultiGuess();
  } else if (/^[A-Z]$/.test(key) && turn.current.length < WORD_LENGTH) {
    turn.current += key;
  }

  render();
}

function submitMultiGuess() {
  const match = state.multi;
  const turn = match.turns[match.active];
  if (turn.current.length !== WORD_LENGTH) {
    match.status = "Five letters";
    return;
  }

  const guess = turn.current;
  const result = evaluateGuess(guess, match.answer);
  turn.guesses.push(guess);
  turn.current = "";
  mergeKeyState(turn.keys, guess, result);

  if (guess === match.answer) {
    match.status = "Correct";
    turn.locked = true;
    recordMultiplayerCorrect(match.active, match.answer);
    render();
    window.setTimeout(() => finishTurn(true), 850);
    return;
  }

  if (turn.guesses.length >= MAX_GUESSES) {
    match.status = "Missed";
    turn.locked = true;
    render();
    window.setTimeout(() => finishTurn(false), 850);
  } else {
    match.status = "Try again";
  }
}

function finishTurn(solved) {
  const match = state.multi;
  const turn = match.turns[match.active];
  turn.solved = solved;
  turn.finished = true;
  turn.seconds = Math.max(1, Math.ceil((Date.now() - turn.start) / 1000));

  if (solved) {
    finalizeRound();
  } else if (match.active === 0) {
    match.active = 1;
    match.phase = "ready";
    match.status = "Pass";
  } else {
    finalizeRound();
  }
  render();
}

function finalizeRound() {
  const match = state.multi;
  const p1 = summarizeTurn(match.turns[0]);
  const p2 = summarizeTurn(match.turns[1]);
  const winner = compareTurns(p1, p2);

  if (winner != null) {
    match.scores[winner] += 1;
  }

  match.history.push({
    round: match.round,
    word: match.answer,
    p1,
    p2,
    winner,
  });

  if (match.round >= MATCH_ROUNDS) {
    match.phase = "match";
    match.status = "Match";
    match.pending = "start";
  } else {
    match.phase = "result";
    match.status = winner == null ? "No point" : "Round";
    match.pending = "next";
  }
}

async function recordMultiplayerCorrect(playerIndex, answer) {
  const match = state.multi;
  const turn = match.turns[playerIndex];
  if (turn.saved) return;
  turn.saved = true;

  try {
    await appRequest("/api/multiplayer-records", {
      method: "POST",
      body: JSON.stringify({
        username: match.names[playerIndex],
        score: 1,
        solvedWord: answer,
      }),
    });
    await loadLeaderboard();
  } catch (error) {
    match.status = "Correct not saved";
    render();
  }
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
  const match = state.multi;
  const turn = match.turns[match.active];
  turn.start = Date.now();
  turn.current = "";
  turn.locked = false;
  match.phase = "turn";
  match.status = "0s";
  render();
}

function handleCoverAction() {
  const match = state.multi;
  if (match.phase === "setup") {
    startChallenge();
  } else if (match.phase === "ready") {
    beginMultiTurn();
  } else if (match.phase === "result") {
    prepareMultiRound(match.pending === "next");
    render();
  } else if (match.phase === "match") {
    startChallenge();
  }
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
    if (state.multi.phase === "turn") {
      dom.multiStatus.textContent = getMultiStatus();
    }
  }, 500);
}

boot();
