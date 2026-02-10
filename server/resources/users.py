from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import User

class UserList(Resource):
    @jwt_required()
    def get(self):
        users = User.query.all()
        return [{
            "id": u.id,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email
        } for u in users], 200
