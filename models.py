from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timezone


db = SQLAlchemy()

PASSWORD_HASH_METHOD = "scrypt"


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="player")
    games = db.relationship(
        "GameRecord",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    @property
    def is_admin(self):
        return self.role == "admin"

    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method=PASSWORD_HASH_METHOD)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
        }


class GameRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    mode = db.Column(db.String(30), nullable=False, default="streak")
    score = db.Column(db.Integer, nullable=False, default=0)
    words_solved = db.Column(db.Integer, nullable=False, default=0)
    failed_word = db.Column(db.String(5), nullable=True)
    played_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = db.relationship("User", back_populates="games")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username,
            "mode": self.mode,
            "score": self.score,
            "words_solved": self.words_solved,
            "failed_word": self.failed_word,
            "played_at": self.played_at.isoformat(),
        }
