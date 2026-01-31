from flask import Blueprint, request, jsonify
from .extensions import db
from .models import Project
from flask_jwt_extended import jwt_required

crud_bp = Blueprint("crud", __name__)


@crud_bp.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    data = request.get_json()
    project = Project(
        title=data.get("title"),
        description=data.get("description"),
        video=data.get("video"),
        technologies=data.get("technologies"),
        submitted_name=data.get("submitted_name"),
        status=data.get("status", "pending")
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({"message": "Project created", "project_id": project.id}), 201


@crud_bp.route("/projects", methods=["GET"])
def get_projects():
    projects = Project.query.all()
    result = []
    for p in projects:
        result.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "video": p.video,
            "technologies": p.technologies,
            "submitted_name": p.submitted_name,
            "status": p.status
        })
    return jsonify(result)


@crud_bp.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify({
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "video": project.video,
        "technologies": project.technologies,
        "submitted_name": project.submitted_name,
        "status": project.status
    })



@crud_bp.route("/projects/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.get_json()
    project.title = data.get("title", project.title)
    project.description = data.get("description", project.description)
    project.video = data.get("video", project.video)
    project.technologies = data.get("technologies", project.technologies)
    project.status = data.get("status", project.status)
    db.session.commit()
    return jsonify({"message": "Project updated"})


@crud_bp.route("/projects/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"message": "Project deleted"})
