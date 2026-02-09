from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request

from models import db, Project, UserProject, ProjectCategory, User, Category, ProjectLike


class ProjectList(Resource):
    def get(self):
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except Exception:
            user_id = None

        projects = Project.query.all()
        result = []

        for p in projects:
            team_dict = {}
            for up in p.users:
                uid = up.user.id
                if uid not in team_dict:
                    team_dict[uid] = {
                        "id": up.user.id,
                        "first_name": up.user.first_name,
                        "last_name": up.user.last_name,
                        "email": up.user.email,
                        "role": up.user.role.name,
                        "project_roles": [up.action]
                    }
                else:
                    if up.action not in team_dict[uid]["project_roles"]:
                        team_dict[uid]["project_roles"].append(up.action)

        team = list(team_dict.values())

        cats = [
                {"id": pc.category.id, "name": pc.category.name}
                for pc in p.categories if pc.category
            ]

        likes_count = ProjectLike.query.filter_by(project_id=p.id).count()
        liked_by_me = False
        if user_id:
                liked_by_me = ProjectLike.query.filter_by(
                    project_id=p.id,
                    user_id=user_id
                ).first() is not None

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
                "categories": cats,

                
                "likes_count": likes_count,
                "liked_by_me": liked_by_me,
            })

        return result, 200


    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()

        title = data.get("title")
        description = data.get("description")
        video = data.get("video")
        technologies = data.get("technologies")
        submitted_name = data.get("submitted_name")
        github_url = data.get("github_url") 
        team_members = data.get("team_members", [])
        category_ids = data.get("category_ids", [])

        if not all([title, description, video, technologies, submitted_name, github_url]):
            return {"error": "Missing required fields"}, 400

        project = Project(
            title=title,
            description=description,
            video=video,
            technologies=technologies,
            submitted_name=submitted_name,
            github_url=github_url,
        )
        db.session.add(project)
        db.session.commit()

        creator_link = UserProject(
            user_id=user_id,
            project_id=project.id,
            action="creator"
        )
        db.session.add(creator_link)
#adds creator as contributor to the project
        db.session.add(UserProject(
        user_id=user_id,
        project_id=project.id,
        action="contributor"
))

        for member_id in team_members:
            user = User.query.get(member_id)
            if user:
                db.session.add(UserProject(
                    user_id=user.id,
                    project_id=project.id,
                    action="contributor"
                ))

        
        for cat_id in category_ids:
            category = Category.query.get(cat_id)
            if category:
                db.session.add(ProjectCategory(
                    project_id=project.id,
                    category_id=category.id
                ))

        db.session.commit()

        return {"message": "Project created", "project_id": project.id}, 201


class ProjectDetail(Resource):
    @jwt_required()
    def get(self, project_id):
        project = Project.query.get_or_404(project_id)

        team_dict = {}
        for up in project.users:
            uid = up.user.id
            if uid not in team_dict:
                team_dict[uid] = {
                    "id": up.user.id,
                    "first_name": up.user.first_name,
                    "last_name": up.user.last_name,
                    "email": up.user.email,
                    "role": up.user.role.name,
                    "project_roles": [up.action]
                }
            else:
                if up.action not in team_dict[uid]["project_roles"]:
                    team_dict[uid]["project_roles"].append(up.action)

        team = list(team_dict.values())


        categories = [
            {"id": pc.category.id, "name": pc.category.name}
            for pc in project.categories if pc.category
        ]

        return {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "video": project.video,
            "technologies": project.technologies,
            "submitted_name": project.submitted_name,
            "status": project.status,
            "created_at": str(project.created_at),
            "team_members": team,
            "categories": categories
        }, 200

    @jwt_required()
    def patch(self, project_id):
        user_id = get_jwt_identity()
        project = Project.query.get_or_404(project_id)
        data = request.get_json()

        # Only creator or admin can update
        creator = next((up.user_id for up in project.users if up.action=="creator"), None)
        current_user_role = User.query.get(user_id).role.name
        if user_id != creator and current_user_role != "admin":
            return {"error": "Unauthorized"}, 403

        if "title" in data:
            project.title = data["title"]
        if "description" in data:
            project.description = data["description"]
        if "video" in data:
            project.video = data["video"]
        if "technologies" in data:
            project.technologies = data["technologies"]

        db.session.commit()
        return {"message": "Project updated"}, 200

    # @jwt_required()
    # def delete(self, project_id):
    #     user_id = get_jwt_identity()
    #     project = Project.query.get_or_404(project_id)

    #     # Only creator or admin can delete
    #     creator = next((up.user_id for up in project.users if up.action=="creator"), None)
    #     current_user_role = User.query.get(user_id).role.name
    #     if user_id != creator and current_user_role != "admin":
    #         return {"error": "Unauthorized"}, 403

    #     db.session.delete(project)
    #     db.session.commit()
    #     return {"message": "Project deleted"}, 200
