from app import app
from models import (db,User,UserRole,Project,UserProject,Category,ProjectCategory,Merchandise,Order,OrderMerchandise,)
from datetime import datetime, UTC
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
        created_at=datetime.now(UTC),
    )
    db.session.add(admin)

    students = []
    for _ in range(10):
        student = User(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.unique.email()[:255],
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

def seed_categories():
    names = ["HealthTech", "EdTech", "FinTech", "AgriTech", "AI", "E-Commerce"]

    for name in names:
        db.session.add(
            Category(
                name=name,
                description=fake.sentence(),
            )
        )

    db.session.commit()

def seed_projects(students):
    categories = Category.query.all()

    for _ in range(10):
        project_title = fake.sentence(nb_words=4).rstrip(".")
        slug = "-".join(project_title.lower().split())

        project = Project(
            title=project_title,
            description=fake.paragraph(nb_sentences=4),
            video=fake.url(),
            github_url=f"https://github.com/{fake.user_name()}/{slug}",
            technologies=", ".join(fake.words(4)),
            submitted_name=fake.name(),
            approval_reason=fake.sentence(),
            rejection_reason=fake.sentence(),
            status=random.choice(["pending", "approved", "rejected"]),
        )
        db.session.add(project)
        db.session.commit()

        owner = random.choice(students)

        db.session.add(
            UserProject(
                user_id=owner.id,
                project_id=project.id,
                action="owner",
            )
        )

        contributors = random.sample(
            [s for s in students if s.id != owner.id],
            k=random.randint(1, 3),
        )

        for student in contributors:
            db.session.add(
                UserProject(
                    user_id=student.id,
                    project_id=project.id,
                    action="contributor",
                )
            )

        for category in random.sample(categories, k=2):
            db.session.add(
                ProjectCategory(
                    project_id=project.id,
                    category_id=category.id,
                )
            )

        db.session.commit()
CLOUDINARY_MERCH_IMAGES = {
    "Moringa Hoodie": "https://res.cloudinary.com/drxd3fs4g/image/upload/v1770733304/hoodies_zeit7y.jpg",
    "Moringa Mug": "https://res.cloudinary.com/drxd3fs4g/image/upload/v1770733303/Nap_First_Panic_Later_Mug___Cute_Sleeping_Duck_Coffee_Tea_Cup_M052_gukdsg.jpg",
    "Moringa T-Shirt": "https://res.cloudinary.com/drxd3fs4g/image/upload/v1770733303/I_Get_My_Cardio_By_Running_Code_Shirt___Computer_Science___Computer_Programmer_Saying_Gift_T-shirt_uj2hwy.jpg",
    "Laptop Sticker Pack": "https://res.cloudinary.com/drxd3fs4g/image/upload/v1770733302/download_mzqgeq.jpg",
    "Mechanical Keyboard Keycap Set":"https://res.cloudinary.com/drxd3fs4g/image/upload/v1770816161/PBT_Shine_Through_Double_Shot_Keycaps_142_Keys_Cherry_Profile_Backlit_Keycaps_for_Cherry_Gateron_MX_wvluip.jpg",
    "USB Flash Drive":"https://res.cloudinary.com/drxd3fs4g/image/upload/v1770816161/Fingerprint_USB3_0_Flash_Drive_Encrypted_64G_Memory_Stick_Pen_Zip_Drive_Biometric_Security_Protection_Thumb_Drive_for_PC_Smartphone_Laptop__fpi5dh.jpg",
    "Moringa Laptop Sleeve":"https://res.cloudinary.com/drxd3fs4g/image/upload/v1770816161/1pc_Butterfly_Letter_Graphic_Laptop_Bag_fclbgl.jpg",
    "Mouse Pad":"https://res.cloudinary.com/drxd3fs4g/image/upload/v1770816161/Eat_Sleep_Code_Repeat___Mouse_Pad_-_Etsy_suyscv.jpg"
}

def seed_merchandise():
    items = [
        ("Moringa Hoodie", 3500),
        ("Moringa Mug", 1200),
        ("Moringa T-Shirt", 2500),
        ("Laptop Sticker Pack", 800),
        ("Mechanical Keyboard Keycap Set", 1500),
        ("USB Flash Drive", 1000),
        ("Moringa Laptop Sleeve", 2000),
        ("Mouse Pad", 700),
    ]

    for name, price in items:
        image_url = CLOUDINARY_MERCH_IMAGES[name]

        db.session.add(
            Merchandise(
                name=name,
                description=fake.sentence(),
                price=price,
                stock=random.randint(10, 50),
                image_url=image_url,
            )
        )

    db.session.commit()



def seed_orders():
    users = User.query.all()
    merch = Merchandise.query.all()

    for _ in range(5):
        user = random.choice(users)
        order = Order(
            user_id=user.id,
            total_amount=0,
            status="completed",
        )
        db.session.add(order)
        db.session.commit()

        total = 0
        for item in random.sample(merch, k=2):
            qty = random.randint(1, 3)
            total += float(item.price) * qty

            db.session.add(
                OrderMerchandise(
                    order_id=order.id,
                    merchandise_id=item.id,
                    quantity=qty,
                    price_at_purchase=item.price,
                )
            )

        order.total_amount = total
        db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        print("Cleared database")
        clear_db()

        print("Seed roles")
        seed_roles()

        print("Seed users")
        students = seed_users()

        print("Seed categories")
        seed_categories()

        print("Seed projects")
        seed_projects(students)

        print("Seed merchandise")
        seed_merchandise()

        print("Seed orders")
        seed_orders()

        print("Database seeded successfully")
