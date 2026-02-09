from flask import request
from flask_restful import Resource
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, UserRole


class Signup(Resource):
    def post(self):
        data = request.get_json()

        required = ["first_name", "last_name", "email", "password"]
        if not all(field in data for field in required):
            return {"error": "Missing required fields"}, 400

        if User.query.filter_by(email=data["email"]).first():
            return {"error": "Email already exists"}, 400

        role_name = data.get("role", "student").lower() 

        if role_name not in ["student", "recruiter"]:
            return {"error": "Invalid role"}, 400

        role = UserRole.query.filter_by(name=role_name).first()
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

        return {
            "message": f"Signup successful as {role_name}",
            "user_id": user.id,
            "role": role_name
        }, 201


class Login(Resource):
    def post(self):
        data = request.get_json()

        user = User.query.filter_by(email=data.get("email")).first()
        if not user or not check_password_hash(user.password_hash, data.get("password")):
            return {"error": "Invalid credentials"}, 401
        
        token = create_access_token(identity=str(user.email))
        return {
            "access_token": token,
            "user_id": user.id,
            "role": user.role.name
        }, 200

class UpdateProfile(Resource):
    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()
        data = request.get_json()

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        if "first_name" in data:
            user.first_name = data["first_name"]

        if "last_name" in data:
            user.last_name = data["last_name"]

        if "password" in data:
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