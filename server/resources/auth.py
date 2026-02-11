from flask import request
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from models import db, User, UserRole


class Signup(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}

        required = ["first_name", "last_name", "email", "password"]
        if not all(data.get(field) for field in required):
            return {"error": "Missing required fields"}, 400

        email = str(data.get("email")).strip().lower()
        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        role_name = (data.get("role") or "student").lower().strip()
        if role_name not in ["student", "recruiter"]:
            return {"error": "Invalid role"}, 400

        role = UserRole.query.filter_by(name=role_name).first()
        if not role:
            return {"error": "Roles not seeded"}, 500

        user = User(
            first_name=str(data["first_name"]).strip(),
            last_name=str(data["last_name"]).strip(),
            email=email,
            password_hash=generate_password_hash(data["password"]),
            role_id=role.id,
        )

        db.session.add(user)
        db.session.commit()

        return {
            "message": f"Signup successful as {role_name}",
            "user_id": user.id,
            "role": role_name
        }, 201


class Login(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}

        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return {"error": "Invalid credentials"}, 401

       
        token = create_access_token(identity=str(user.id))

        return {
            "access_token": token,
            "user_id": user.id,
            "role": user.role.name if user.role else None,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        }, 200


class UpdateProfile(Resource):
    @jwt_required()
    def patch(self):
        
        raw_id = get_jwt_identity()
        try:
            user_id = int(raw_id)
        except (TypeError, ValueError):
            return {"error": "Invalid token identity. Please log in again."}, 401

        data = request.get_json(silent=True) or {}

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        if "first_name" in data:
            user.first_name = str(data["first_name"]).strip()

        if "last_name" in data:
            user.last_name = str(data["last_name"]).strip()

        if "password" in data and data["password"]:
            user.password_hash = generate_password_hash(data["password"])

        db.session.commit()

        return {
            "message": "Profile updated successfully",
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email
            }
        }, 200
