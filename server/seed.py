from app import app
from models import (db,User,UserRole,Project,UserProject,Category,ProjectCategory,Merchandise,Order,OrderMerchandise,)
from datetime import datetime
from werkzeug.security import generate_password_hash
from faker import Faker
import random

fake = Faker()

def clear_db():
    OrderMerchandise.query.delete()
    Order.query.delete()
    UserProject.query.delete()
    ProjectCategory.query.delete()
    Project.query.delete()
    Merchandise.query.delete()
    Category.query.delete()
    User.query.delete()
    UserRole.query.delete()
    db.session.commit()

def seed_roles():
    roles = [
        ("admin", "Has full system access"),
        ("student", "Can create and collaborate on projects"),
        ("recruiter", "Can browse approved projects"),
    ]

    for name, desc in roles:
        db.session.add(UserRole(name=name, description=desc))

    db.session.commit()

def seed_users():
    admin_role = UserRole.query.filter_by(name="admin").first()
    student_role = UserRole.query.filter_by(name="student").first()
    recruiter_role = UserRole.query.filter_by(name="recruiter").first()

    admin = User(
        first_name="Fred",
        last_name="Chen",
        email="admin@moringa.co.ke",
        password_hash=generate_password_hash("Admin1234"),
        role_id=admin_role.id,
        status="active",
        created_at=datetime.utcnow(),
    )
    db.session.add(admin)

    students = []
    for _ in range(15):
        student = User(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.unique.email(),
            password_hash=generate_password_hash("Student1234"),
            role_id=student_role.id,
            status="active",
        )
        students.append(student)
        db.session.add(student)

    for _ in range(5):
        db.session.add(
            User(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.unique.email(),
                password_hash=generate_password_hash("Recruiter1234"),
                role_id=recruiter_role.id,
                status="active",
            )
        )

    db.session.commit()
    return students   

if __name__ == "__main__":
    with app.app_context():
        print("Cleared database")
        clear_db()

        print("Seed roles")
        seed_roles()

        print("Seed users")
        students = seed_users()
