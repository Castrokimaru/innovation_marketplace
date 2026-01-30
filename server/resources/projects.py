from flask_restful import Resource
from flask import request
from models import db, Project

class ProjectList(Resource):
    def post(self):
        data = request.get_json()

        project = Project(
            title=data["title"],
            description=data["description"],
            technologies=data["technologies"],
            video=data.get("video", ""),
            submitted_name=data["submitted_name"],
            status="pending"
        )

        db.session.add(project)
        db.session.commit()

        return {"message": "Project submitted for review"}, 201


class ProjectDetail(Resource):
    def get(self, project_id):
        project = Project.query.get_or_404(project_id)

        return {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "technologies": project.technologies,
            "status": project.status
        }, 200