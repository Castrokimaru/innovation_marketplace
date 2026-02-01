from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, User, Project, UserProject, Category, ProjectCategory


class ProjectList(Resource):
#GET all projects with their contributors
    def get(self):
        projects = Project.query.all()
        result = []

        for p in projects:
            # Getting all users linked to this project
            contributors = (
                User.query
                .join(UserProject)
                .filter(UserProject.project_id == p.id)
                .all()
            )

            team = [
                {
                    "id": u.id,
                    "first_name": u.first_name,
                    "last_name": u.last_name,
                    "email": u.email,
                    "role": u.role.name
                } for u in contributors
            ]
            # Get categories
            cats = [
                {"id": c.category.id, "name": c.category.name}
                for c in p.categories
            ]

            result.append({
                "id": p.id,
                "title": p.title,
                "description": p.description,
                "video": p.video,
                "technologies": p.technologies,
                "submitted_name": p.submitted_name,
                "status": p.status,
                "created_at": str(p.created_at),
                "team_members": team,
                "categories": cats
            })

        return result, 200
        # return [
        #     {
        #         "id": p.id,
        #         "title": p.title,
        #         "status": p.status,
        #         "technologies": p.technologies
        #     } for p in projects
        # ], 200

    @jwt_required()
# Creating a project with creator + contributors
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json()

        # category_ids = data.get("category_ids", [])  # list of category IDs
        # categories = []
        # for cid in category_ids:
        #     cat = Category.query.get(cid)
        #     if not cat:
        #         return {"error": f"Category id {cid} not found"}, 400
        # categories.append(cat)

        project = Project(
            title=data["title"],
            description=data["description"],
            video=data["video"],
            technologies=data["technologies"],
            submitted_name=data["submitted_name"],
        )

        db.session.add(project)
        db.session.commit()
#linking the project to the creator
        db.session.add(UserProject(
            user_id=user_id,
            project_id=project.id,
            action="creator"
        ))
#linking team members
        for member_id in data.get("team_members", []):
            # skip if user_id == creator
            if member_id == user_id:
                continue

            member = User.query.get(member_id)
            if not member:
                return {"error": f"User id {member_id} not found"}, 400
        
            db.session.add(UserProject(
                user_id=member_id,
                project_id=project.id,
                action="contributor"
            ))
#link categories
        for cid in data.get("category_ids", []):
            cat = Category.query.get(cid)
            if not cat:
                return {"error": f"Category id {cid} not found"}, 400
            db.session.add(ProjectCategory(
                project_id=project.id,
                category_id=cat.id
            ))

        # db.session.add(link)
        # for cat in categories:
        #     project_category_link = ProjectCategory(
        #         project_id=project.id,
        #         category_id=cat.id
        #     )
        # db.session.add(project_category_link)

        db.session.commit()
        return {"message": "Project submitted"}, 201
