from app import app
from models import db, User, UserRole
from datetime import datetime
from werkzeug.security import generate_password_hash

def seed_roles():
    roles = [
        {
            "name": "admin",
            "description": "Full system access: approve projects, manage users, manage merchandise inventory, and view all system data."
        },
        {
            "name": "student",
            "description": "Can submit and manage own projects, add contributors, view project status, and purchase merchandise."
        },
        {
            "name": "contributor",
            "description": "Can be added to projects as a team member, collaborate on projects, view project details, and purchase merchandise."
        },
        {
            "name": "recruiter",
            "description": "Can browse approved projects, contact or hire project teams, and purchase merchandise."
        },
    ]

    for role in roles:
        exists = UserRole.query.filter_by(name=role["name"]).first()
        if not exists:
            new_role = UserRole(
                name=role["name"],
                description=role["description"]
            )
            db.session.add(new_role)

    db.session.commit()


def seed_admin():
    admin_role = UserRole.query.filter_by(name="admin").first()

    admin_exists = User.query.filter_by(email="admin@moringa.co.ke").first()
    if admin_exists:
        return

    
    admin = User(
        first_name="Fred",
        last_name="Chen",
        email="admin@moringa.co.ke",
        password_hash=generate_password_hash("admin123"),
        role_id=admin_role.id,
        created_at=datetime.utcnow(),
        status="active"
    )

    db.session.add(admin)
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        seed_roles()
        seed_admin()
        print("Database seeded")
