from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, User

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
        return {"message": f"Project {project.title} approved"}, 200
