from flask import request
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from models import db, User, UserRole


class Signup(Resource):
    def post(self):
        data = request.get_json()

        required = ["first_name", "last_name", "email", "password"]
        if not all(field in data for field in required):
            return {"error": "Missing required fields"}, 400

        if User.query.filter_by(email=data["email"]).first():
            return {"error": "Email already exists"}, 400

        role = UserRole.query.filter_by(name="student").first()
        if not role:
            return {"error": "Roles not seeded"}, 500

        user = User(
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            password_hash=generate_password_hash(data["password"]),
            role_id=role.id,
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "Signup successful"}, 201


class Login(Resource):
    def post(self):
        data = request.get_json()

        user = User.query.filter_by(email=data.get("email")).first()
        if not user or not check_password_hash(user.password_hash, data.get("password")):
            return {"error": "Invalid credentials"}, 401

        token = create_access_token(identity=user.id)
        return {
            "access_token": token,
            "user_id": user.id,
            "role": user.role.name
        }, 200
