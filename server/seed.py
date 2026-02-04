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



if __name__ == "__main__":
    with app.app_context():
        print("Cleared database")
        clear_db()

        print("Seeding roles")
        seed_roles()
