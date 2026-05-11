from functools import wraps

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

from models import User, db


admin = Blueprint("admin", __name__, url_prefix="/api/admin")


def admin_required(view):
    @wraps(view)
    @login_required
    def wrapped(*args, **kwargs):
        if not current_user.is_admin:
            return jsonify({"error": "Admin access required"}), 403
        return view(*args, **kwargs)

    return wrapped


@admin.route("/players", methods=["GET"])
@admin_required
def players():
    users = (
        User.query.filter(User.role != "admin")
        .order_by(User.username.asc())
        .all()
    )
    return jsonify({"players": [user.to_dict() for user in users]})


@admin.route("/players/<int:user_id>/password", methods=["POST"])
@admin_required
def change_player_password(user_id):
    user = db.session.get(User, user_id)
    if not user or user.is_admin:
        return jsonify({"error": "Player not found"}), 404

    password = (request.get_json(silent=True) or {}).get("password", "")
    if not password:
        return jsonify({"error": "Password is required"}), 400

    user.set_password(password)
    db.session.commit()
    return jsonify({"message": f"{user.username} password updated"})


@admin.route("/players/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_player(user_id):
    user = db.session.get(User, user_id)
    if not user or user.is_admin:
        return jsonify({"error": "Player not found"}), 404

    username = user.username
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"{username} deleted"})
