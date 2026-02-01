from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Project, UserProject, Category, ProjectCategory


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

        category_ids = data.get("category_ids", [])  # list of category IDs
        categories = []
        for cid in category_ids:
            cat = Category.query.get(cid)
            if not cat:
                return {"error": f"Category id {cid} not found"}, 400
        categories.append(cat)

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
        for cat in categories:
            project_category_link = ProjectCategory(
                project_id=project.id,
                category_id=cat.id
            )
        db.session.add(project_category_link)

        db.session.commit()
        return {"message": "Project submitted"}, 201
