import os

from flask import Flask
from flask_login import LoginManager

from admin import admin
from auth import auth
from leaderboard import leaderboard
from main import main
from models import User, db


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-change-this-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get(
        "DATABASE_URL",
        "sqlite:///word_run.db",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.login_message = None
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    app.register_blueprint(auth)
    app.register_blueprint(main)
    app.register_blueprint(admin)
    app.register_blueprint(leaderboard)

    with app.app_context():
        db.create_all()
        seed_default_users()

    return app


def seed_default_users():
    defaults = [
        ("admin", "admin@example.com", "admin", "admin"),
        ("player1", "player1@example.com", "player1", "player"),
        ("player2", "player2@example.com", "player2", "player"),
    ]

    for username, email, password, role in defaults:
        user = User.query.filter_by(username=username).first()
        if user:
            continue

        user = User(username=username, email=email, role=role)
        user.set_password(password)
        db.session.add(user)

    db.session.commit()


app = create_app()


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1")
