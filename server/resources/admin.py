from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, User, Project, Category, UserProject

#adding category
class CategoryCreate(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if user.role.name != "admin":
            return {"error": "Only admin can add categories"}, 403

        data = request.get_json()
        if Category.query.filter_by(name=data["name"]).first():
            return {"error": "Category already exists"}, 400

        category = Category(
            name=data["name"],
            description=data.get("description", "")
        )
        db.session.add(category)
        db.session.commit()
        return {"message": f"Category '{category.name}' created"}, 201

#approve or reject projects
class ApproveProject(Resource):
    @jwt_required()
    def post(self, project_id):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if user.role.name != "admin":
            return {"error": "Only admin can approve projects"}, 403

        project = Project.query.get(project_id)
        if not project:
            return {"error": "Project not found"}, 404

        project.status = "approved"
        db.session.commit()
        return {"message": f"Project '{project.title}' approved"}, 200


class RejectProject(Resource):
    @jwt_required()
    def post(self, project_id):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if user.role.name != "admin":
            return {"error": "Only admin can reject projects"}, 403

        project = Project.query.get(project_id)
        if not project:
            return {"error": "Project not found"}, 404

        project.status = "rejected"
        db.session.commit()
        return {"message": f"Project '{project.title}' rejected"}, 200
