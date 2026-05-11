import random
import string
from datetime import datetime, timezone

from flask_login import current_user
from flask_socketio import SocketIO, emit, join_room, leave_room

from models import GameRecord, db


socketio = SocketIO(cors_allowed_origins="*", async_mode="threading")

ANSWERS = [
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
#   // "ARROW",
#   // "BASIC",
#   // "BATCH",
#   // "BEACH",
#   // "BEARD",
#   // "BENCH",
#   // "BLADE",
#   // "BLEND",
#   // "BLOOM",
#   // "BOARD",
#   // "BRAIN",
#   // "BRAVE",
#   // "BRICK",
#   // "BRING",
#   // "BROAD",
#   // "CABLE",
#   // "CANDY",
#   // "CARRY",
#   // "CHAIN",
#   // "CHAIR",
#   // "CHARM",
#   // "CHESS",
#   // "CIVIC",
#   // "CLEAR",
#   // "CLOUD",
#   // "COAST",
#   // "CORAL",
#   // "CRANE",
#   // "CRISP",
#   // "CROWN",
#   // "DAILY",
#   // "DAIRY",
#   // "DANCE",
#   // "DELTA",
#   // "DREAM",
#   // "DRIFT",
#   // "EAGER",
#   // "EARTH",
#   // "ELBOW",
#   // "ELDER",
#   // "ENTRY",
#   // "FAITH",
#   // "FANCY",
#   // "FIELD",
#   // "FLAME",
#   // "FLEET",
#   // "FLOUR",
#   // "FOCUS",
#   // "FORGE",
#   // "FRAME",
#   // "FRESH",
#   // "FRONT",
#   // "GIANT",
#   // "GLASS",
#   // "GLOBE",
#   // "GRACE",
#   // "GRADE",
#   // "GRAND",
#   // "GRAPE",
#   // "GREEN",
#   // "GUARD",
#   // "HAPPY",
#   // "HEART",
#   // "HONEY",
#   // "HORSE",
#   // "HOUSE",
#   // "HUMAN",
#   // "IDEAL",
#   // "IMAGE",
#   // "INDEX",
#   // "INNER",
#   // "IVORY",
#   // "JELLY",
#   // "JOLLY",
#   // "JUDGE",
#   // "JUICE",
#   // "KNIFE",
#   // "LASER",
#   // "LAYER",
#   // "LEMON",
#   // "LIGHT",
#   // "LIMIT",
#   // "LODGE",
#   // "MAGIC",
#   // "MAJOR",
#   // "MANGO",
#   // "MAPLE",
#   // "MARCH",
#   // "MATCH",
#   // "MERCY",
#   // "METAL",
#   // "MIGHT",
#   // "MODEL",
#   // "MONEY",
#   // "MONTH",
#   // "MOTOR",
#   // "MUSIC",
#   // "NERVE",
#   // "NIGHT",
#   // "NOBLE",
#   // "NORTH",
#   // "NOVEL",
#   // "OCEAN",
#   // "OLIVE",
#   // "ONION",
#   // "ORBIT",
#   // "OTHER",
#   // "PAINT",
#   // "PANEL",
#   // "PAPER",
#   // "PARTY",
#   // "PEACE",
#   // "PEARL",
#   // "PIANO",
#   // "PILOT",
#   // "PLANT",
#   // "PLATE",
#   // "POINT",
#   // "PRIDE",
#   // "PRIME",
#   // "PRIZE",
#   // "QUEEN",
#   // "QUICK",
#   // "QUIET",
#   // "RADAR",
#   // "RADIO",
#   // "RANCH",
#   // "REACH",
#   // "READY",
#   // "RIVER",
#   // "ROAST",
#   // "ROBIN",
#   // "ROUND",
#   // "ROYAL",
#   // "SALAD",
#   // "SCALE",
#   // "SCENE",
#   // "SCOPE",
#   // "SHARE",
#   // "SHARP",
#   // "SHELF",
#   // "SHINE",
#   // "SKILL",
#   // "SMART",
#   // "SMILE",
#   // "SOLAR",
#   // "SOLID",
#   // "SOUND",
#   // "SPACE",
#   // "SPARK",
#   // "SPEED",
#   // "SPICE",
#   // "STAGE",
#   // "STAND",
#   // "STEAM",
#   // "STONE",
#   // "STORM",
#   // "STORY",
#   // "SUGAR",
#   // "SUPER",
#   // "SWEET",
#   // "TABLE",
#   // "TEACH",
#   // "TIGER",
#   // "TIMER",
#   // "TOAST",
#   // "TOWER",
#   // "TRACE",
#   // "TRAIL",
#   // "TRAIN",
#   // "TRUST",
#   // "UNION",
#   // "UNITY",
#   // "VALUE",
#   // "VIDEO",
#   // "VOICE",
#   // "WATER",
#   // "WHEEL",
#   // "WHOLE",
#   // "WORLD",
#   // "WORTH",
#   // "YEAST",
#   // "YOUNG",
#   // "ZEBRA",
]

MAX_GUESSES = 6
WORD_LENGTH = 5
MATCH_ROUNDS = 3
STATUS_RANK = {"absent": 1, "present": 2, "correct": 3}

rooms = {}
sid_to_room = {}


def make_room_code():
    while True:
        code = "".join(random.choice(string.ascii_uppercase + string.digits) for _ in range(5))
        if code not in rooms:
            return code


def pick_answer(previous=None):
    answer = random.choice(ANSWERS)
    if len(ANSWERS) > 1:
        while answer == previous:
            answer = random.choice(ANSWERS)
    return answer


def create_turn():
    return {
        "current": "",
        "guesses": [],
        "keys": {},
        "solved": False,
        "finished": False,
        "seconds": 0,
        "started_at": None,
    }


def create_room(code):
    return {
        "code": code,
        "players": [],
        "round": 1,
        "scores": [0, 0],
        "answer": pick_answer(),
        "last_answer": None,
        "phase": "lobby",
        "turns": [create_turn(), create_turn()],
        "history": [],
        "status": "Waiting for player 2",
    }


def evaluate_guess(guess, answer):
    result = ["absent"] * WORD_LENGTH
    pool = list(answer)

    for index, letter in enumerate(guess):
        if letter == answer[index]:
            result[index] = "correct"
            pool[index] = ""

    for index, letter in enumerate(guess):
        if result[index] == "correct":
            continue
        try:
            match_index = pool.index(letter)
        except ValueError:
            continue
        result[index] = "present"
        pool[match_index] = ""

    return result


def merge_key_state(keys, guess, result):
    for index, letter in enumerate(guess):
        next_status = result[index]
        current_status = keys.get(letter)
        if not current_status or STATUS_RANK[next_status] > STATUS_RANK[current_status]:
            keys[letter] = next_status


def public_room_state(room, viewer_index=None):
    return {
        "code": room["code"],
        "players": [
            {
                "index": index,
                "userId": player["user_id"],
                "username": player["username"],
                "connected": player["connected"],
            }
            for index, player in enumerate(room["players"])
        ],
        "round": room["round"],
        "scores": room["scores"],
        "phase": room["phase"],
        "turns": [
            {
                "guesses": [
                    {
                        "word": guess["word"] if index == viewer_index else "?????",
                        "result": guess["result"],
                    }
                    for guess in turn["guesses"]
                ],
                "keys": turn["keys"],
                "solved": turn["solved"],
                "finished": turn["finished"],
                "seconds": turn["seconds"],
            }
            for index, turn in enumerate(room["turns"])
        ],
        "history": room["history"],
        "status": room["status"],
    }


def emit_room_state(room):
    for index, player in enumerate(room["players"]):
        if player["connected"]:
            socketio.emit("match_state", public_room_state(room, index), to=player["sid"])


def find_player(room, sid=None, user_id=None):
    for index, player in enumerate(room["players"]):
        if sid and player["sid"] == sid:
            return index, player
        if user_id and player["user_id"] == user_id:
            return index, player
    return None, None


def start_round(room, advance=False):
    if advance:
        room["round"] += 1
    room["last_answer"] = room["answer"]
    room["answer"] = pick_answer(room["last_answer"])
    room["phase"] = "playing"
    room["turns"] = [create_turn(), create_turn()]
    now = datetime.now(timezone.utc)
    for turn in room["turns"]:
        turn["started_at"] = now
    room["status"] = f"Round {room['round']} live"


def summarize_turn(turn):
    return {
        "finished": turn["finished"],
        "solved": turn["solved"],
        "guesses": len(turn["guesses"]),
        "seconds": turn["seconds"],
    }


def compare_turns(turns):
    p1 = summarize_turn(turns[0])
    p2 = summarize_turn(turns[1])
    if p1["solved"] and not p2["solved"]:
        return 0
    if not p1["solved"] and p2["solved"]:
        return 1
    if not p1["solved"] and not p2["solved"]:
        return None
    if p1["guesses"] != p2["guesses"]:
        return 0 if p1["guesses"] < p2["guesses"] else 1
    if p1["seconds"] != p2["seconds"]:
        return 0 if p1["seconds"] < p2["seconds"] else 1
    return None


def finish_player_turn(room, player_index, solved):
    turn = room["turns"][player_index]
    if turn["finished"]:
        return
    started_at = turn["started_at"] or datetime.now(timezone.utc)
    turn["solved"] = solved
    turn["finished"] = True
    turn["seconds"] = max(
        1,
        int((datetime.now(timezone.utc) - started_at).total_seconds() + 0.999),
    )

    if solved:
        record_multiplayer_word(room["players"][player_index]["user_id"], room["answer"])

    if all(item["finished"] for item in room["turns"]):
        finalize_round(room)


def finalize_round(room):
    winner = compare_turns(room["turns"])
    if winner is not None:
        room["scores"][winner] += 1

    room["history"].append(
        {
            "round": room["round"],
            "word": room["answer"],
            "winner": winner,
            "turns": [summarize_turn(room["turns"][0]), summarize_turn(room["turns"][1])],
        }
    )

    if room["round"] >= MATCH_ROUNDS:
        room["phase"] = "match"
        if room["scores"][0] == room["scores"][1]:
            room["status"] = "Match tied"
        else:
            winner_index = 0 if room["scores"][0] > room["scores"][1] else 1
            room["status"] = f"{room['players'][winner_index]['username']} wins the match"
    else:
        room["phase"] = "result"
        room["status"] = "No point" if winner is None else f"{room['players'][winner]['username']} wins the round"


def record_multiplayer_word(user_id, answer):
    record = GameRecord(
        user_id=user_id,
        mode="multiplayer",
        score=1,
        words_solved=1,
        failed_word=answer,
    )
    db.session.add(record)
    db.session.commit()


@socketio.on("connect")
def handle_connect():
    if not current_user.is_authenticated or current_user.is_admin:
        return False


@socketio.on("disconnect")
def handle_disconnect():
    code = sid_to_room.pop(request_sid(), None)
    if not code:
        return
    room = rooms.get(code)
    if not room:
        return
    player_index, player = find_player(room, sid=request_sid())
    if player:
        player["connected"] = False
        room["status"] = f"{player['username']} disconnected"
        emit_room_state(room)


@socketio.on("join_match")
def handle_join_match(payload):
    if not current_user.is_authenticated or current_user.is_admin:
        emit("match_error", {"message": "Log in as a player first."})
        return

    payload = payload or {}
    requested_code = (payload.get("roomCode") or "").upper().strip()
    code = requested_code or make_room_code()
    room = rooms.get(code)
    if not room:
        room = create_room(code)
        rooms[code] = room

    player_index, player = find_player(room, user_id=current_user.id)
    if player:
        if player["sid"] in sid_to_room:
            sid_to_room.pop(player["sid"], None)
        player["sid"] = request_sid()
        player["connected"] = True
    elif len(room["players"]) < 2:
        player_index = len(room["players"])
        room["players"].append(
            {
                "sid": request_sid(),
                "user_id": current_user.id,
                "username": current_user.username,
                "connected": True,
            }
        )
    else:
        emit("match_error", {"message": "That room is full."})
        return

    join_room(code)
    sid_to_room[request_sid()] = code
    if room["phase"] == "lobby" and len(room["players"]) == 2:
        room["status"] = "Both players ready"

    emit("joined_match", {"roomCode": code, "playerIndex": player_index})
    emit_room_state(room)


@socketio.on("leave_match")
def handle_leave_match():
    code = sid_to_room.pop(request_sid(), None)
    if not code:
        return
    leave_room(code)
    room = rooms.get(code)
    if not room:
        return
    player_index, player = find_player(room, sid=request_sid())
    if player:
        if room["phase"] == "lobby":
            room["players"].pop(player_index)
            room["status"] = "Waiting for player 2"
        else:
            player["connected"] = False
            room["status"] = f"{player['username']} left"
    if not room["players"]:
        rooms.pop(code, None)
        return
    emit_room_state(room)


@socketio.on("start_match")
def handle_start_match():
    room = get_current_room()
    if not room:
        return
    if len(room["players"]) < 2:
        emit("match_error", {"message": "Waiting for player 2."})
        return
    room["round"] = 1
    room["scores"] = [0, 0]
    room["history"] = []
    start_round(room, advance=False)
    emit_room_state(room)


@socketio.on("next_round")
def handle_next_round():
    room = get_current_room()
    if not room:
        return
    if room["phase"] == "result":
        start_round(room, advance=True)
    elif room["phase"] == "match":
        room["round"] = 1
        room["scores"] = [0, 0]
        room["history"] = []
        start_round(room, advance=False)
    emit_room_state(room)


@socketio.on("submit_guess")
def handle_submit_guess(payload):
    room = get_current_room()
    if not room or room["phase"] != "playing":
        return

    player_index, _ = find_player(room, sid=request_sid())
    if player_index is None:
        return

    turn = room["turns"][player_index]
    if turn["finished"]:
        return

    guess = ((payload or {}).get("guess") or "").upper().strip()
    if len(guess) != WORD_LENGTH or not guess.isalpha():
        emit("match_error", {"message": "Enter five letters."})
        return

    result = evaluate_guess(guess, room["answer"])
    turn["guesses"].append({"word": guess, "result": result})
    merge_key_state(turn["keys"], guess, result)

    if guess == room["answer"]:
        finish_player_turn(room, player_index, True)
    elif len(turn["guesses"]) >= MAX_GUESSES:
        finish_player_turn(room, player_index, False)
    else:
        room["status"] = "Guess submitted"

    emit_room_state(room)


def get_current_room():
    code = sid_to_room.get(request_sid())
    return rooms.get(code) if code else None


def request_sid():
    from flask import request

    return request.sid
