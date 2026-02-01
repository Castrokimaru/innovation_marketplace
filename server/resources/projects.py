from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Project, UserProject


class ProjectList(Resource):
    def get(self):
        projects = Project.query.all()
        return [
            {
                "id": p.id,
                "title": p.title,
                "status": p.status,
                "technologies": p.technologies
            } for p in projects
        ], 200

    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json()

        project = Project(
            title=data["title"],
            description=data["description"],
            video=data["video"],
            technologies=data["technologies"],
            submitted_name=data["submitted_name"],
        )

        db.session.add(project)
        db.session.commit()

        link = UserProject(
            user_id=user_id,
            project_id=project.id,
            action="creator"
        )

        db.session.add(link)
        db.session.commit()

        return {"message": "Project submitted"}, 201
