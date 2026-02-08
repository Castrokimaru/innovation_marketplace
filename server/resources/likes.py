from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Project, ProjectLike


class ProjectLikeToggle(Resource):
    @jwt_required()
    def post(self, project_id):
        user_id = get_jwt_identity()

        project = Project.query.get(project_id)
        if not project:
            return {"error": "Project not found"}, 404

        existing = ProjectLike.query.filter_by(
            user_id=user_id, project_id=project_id
        ).first()

        if existing:
            likes_count = ProjectLike.query.filter_by(project_id=project_id).count()
            return {"liked": True, "likes_count": likes_count}, 200

        db.session.add(ProjectLike(user_id=user_id, project_id=project_id))
        db.session.commit()

        likes_count = ProjectLike.query.filter_by(project_id=project_id).count()
        return {"liked": True, "likes_count": likes_count}, 201

    @jwt_required()
    def delete(self, project_id):
        user_id = get_jwt_identity()

        project = Project.query.get(project_id)
        if not project:
            return {"error": "Project not found"}, 404

        existing = ProjectLike.query.filter_by(
            user_id=user_id, project_id=project_id
        ).first()

        if existing:
            db.session.delete(existing)
            db.session.commit()

        likes_count = ProjectLike.query.filter_by(project_id=project_id).count()
        return {"liked": False, "likes_count": likes_count}, 200
