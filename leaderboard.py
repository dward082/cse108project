from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import func

from models import GameRecord, User, db


leaderboard = Blueprint("leaderboard", __name__, url_prefix="/api")


@leaderboard.route("/leaderboard", methods=["GET"])
@login_required
def get_leaderboard():
    words_expression = func.coalesce(func.sum(GameRecord.words_solved), 0)
    rows = (
        db.session.query(
            User.id,
            User.username,
            words_expression.label("words"),
            func.count(GameRecord.id).label("runs"),
            func.max(GameRecord.played_at).label("last_played"),
        )
        .join(GameRecord, GameRecord.user_id == User.id)
        .group_by(User.id, User.username)
        .order_by(
            words_expression.desc(),
            func.count(GameRecord.id).desc(),
            User.username.asc(),
        )
        .limit(10)
        .all()
    )

    result = []
    for index, row in enumerate(rows, start=1):
        result.append(
            {
                "rank": index,
                "user_id": row.id,
                "username": row.username,
                "words": row.words,
                "runs": row.runs,
                "lastPlayed": row.last_played.isoformat() if row.last_played else None,
            }
        )

    current_user_words = (
        db.session.query(func.coalesce(func.sum(GameRecord.words_solved), 0))
        .filter(GameRecord.user_id == current_user.id)
        .scalar()
    )
    current_user_best_score = (
        db.session.query(func.coalesce(func.max(GameRecord.score), 0))
        .filter(GameRecord.user_id == current_user.id, GameRecord.mode == "streak")
        .scalar()
    )

    return jsonify(
        {
            "leaders": result,
            "currentUser": {
                "user_id": current_user.id,
                "username": current_user.username,
                "words": current_user_words or 0,
                "bestScore": current_user_best_score or 0,
            },
        }
    )


@leaderboard.route("/game-records", methods=["POST"])
@login_required
def create_game_record():
    payload = request.get_json(silent=True) or {}
    score = payload.get("score")
    solved_word = (payload.get("solvedWord") or "").upper()[:5] or None

    if not isinstance(score, int) or score <= 0:
        return jsonify({"error": "Score must be a positive number"}), 400

    record = GameRecord(
        user_id=current_user.id,
        mode="streak",
        score=score,
        words_solved=1,
        failed_word=solved_word,
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({"record": record.to_dict()}), 201


@leaderboard.route("/multiplayer-records", methods=["POST"])
@login_required
def create_multiplayer_record():
    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()
    score = payload.get("score")
    solved_word = (payload.get("solvedWord") or "").upper()[:5] or None

    if not username:
        return jsonify({"error": "Player username is required"}), 400

    if not isinstance(score, int) or score <= 0:
        return jsonify({"error": "Score must be a positive number"}), 400

    user = User.query.filter(func.lower(User.username) == username.lower()).first()
    if not user:
        return jsonify({"error": "Winner account not found"}), 404

    record = GameRecord(
        user_id=user.id,
        mode="multiplayer",
        score=score,
        words_solved=score,
        failed_word=solved_word,
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({"record": record.to_dict()}), 201
