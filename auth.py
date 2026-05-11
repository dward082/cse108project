from flask import Blueprint, flash, jsonify, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from sqlalchemy import func

from models import GameRecord, User, db


auth = Blueprint("auth", __name__)


@auth.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))

    if request.method == "POST":
        username = (request.form.get("username") or "").strip()
        password = request.form.get("password") or ""

        if not username or not password:
            flash("Please fill all fields")
            return redirect(url_for("auth.register"))

        if User.query.filter_by(username=username).first():
            flash("Username already exists")
            return redirect(url_for("auth.register"))

        email = f"{username.lower()}@wordle.local"
        new_user = User(username=username, email=email, role="player")
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for("auth.login"))

    return render_template("register.html")


@auth.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))

    if request.method == "POST":
        username = (request.form.get("username") or "").strip()
        password = request.form.get("password") or ""

        if not username or not password:
            flash("Please fill all fields")
            return redirect(url_for("auth.login"))

        user = User.query.filter_by(username=username).first()
        if not user or not user.check_password(password):
            flash("Invalid username or password")
            return redirect(url_for("auth.login"))

        login_user(user)
        return redirect(url_for("main.index"))

    return render_template("login.html")


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("auth.login"))


@auth.route("/api/profile", methods=["PUT"])
@login_required
def update_profile():
    if current_user.is_admin:
        return jsonify({"error": "Admin usernames cannot be changed here"}), 403

    payload = request.get_json(silent=True) or {}
    username = (payload.get("username") or "").strip()

    if not username:
        return jsonify({"error": "Username is required"}), 400

    if len(username) > 18:
        return jsonify({"error": "Username must be 18 characters or fewer"}), 400

    existing = (
        User.query.filter(func.lower(User.username) == username.lower())
        .filter(User.id != current_user.id)
        .first()
    )
    if existing:
        return jsonify({"error": "Username already exists"}), 400

    current_user.username = username
    current_user.email = f"{username.lower()}@wordle.local"
    db.session.commit()

    words_guessed = (
        db.session.query(func.coalesce(func.sum(GameRecord.words_solved), 0))
        .filter(GameRecord.user_id == current_user.id)
        .scalar()
    )
    best_streak = (
        db.session.query(func.coalesce(func.max(GameRecord.score), 0))
        .filter(GameRecord.user_id == current_user.id, GameRecord.mode == "streak")
        .scalar()
    )

    return jsonify(
        {
            "currentUser": {
                "user_id": current_user.id,
                "username": current_user.username,
                "words": words_guessed or 0,
                "bestScore": best_streak or 0,
            },
            "message": "Username updated",
        }
    )


@auth.route("/api/profile/password", methods=["PUT"])
@login_required
def update_password():
    if current_user.is_admin:
        return jsonify({"error": "Admin passwords cannot be changed here"}), 403

    payload = request.get_json(silent=True) or {}
    current_password = payload.get("currentPassword") or ""
    new_password = payload.get("newPassword") or ""

    if not current_password or not new_password:
        return jsonify({"error": "Current and new passwords are required"}), 400

    if not current_user.check_password(current_password):
        return jsonify({"error": "Current password is incorrect"}), 400

    current_user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated"})
