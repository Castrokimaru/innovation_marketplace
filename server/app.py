from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

from models import db

from resources.mpesa import MpesaPay, MpesaCallback
from resources.auth import Signup, Login, UpdateProfile
from resources.projects import ProjectList, ProjectDetail
from resources.merchandise import MerchandiseList, MerchandiseItem
from resources.orders import OrderCreate, OrderDelete, OrderDetail 
from resources.admin import CategoryCreate, ApproveProject, RejectProject, AdminUserList
from resources.recruiters import BrowseProjects
from resources.likes import ProjectLikeToggle
from resources.users import UserList


def create_app():
    app = Flask(__name__)

    # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://biboko:12345678@localhost:5432/moringa_innovation_marketplace_db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-key")

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    api = Api(app)

    api.add_resource(Signup, "/signup")
    api.add_resource(Login, "/login")
    api.add_resource(UpdateProfile, "/profile")

    api.add_resource(ProjectList, "/projects")
    api.add_resource(ProjectDetail, "/projects/<int:project_id>")
    api.add_resource(ProjectLikeToggle, "/projects/<int:project_id>/like")

    api.add_resource(MerchandiseList, "/merchandise")
    api.add_resource(MerchandiseItem, "/merchandise/<int:id>")

    api.add_resource(OrderCreate, "/orders")
    api.add_resource(OrderDetail, "/orders/<int:order_id>")     
    api.add_resource(OrderDelete, "/orders/<int:order_id>")

    api.add_resource(CategoryCreate, "/admin/categories")
    api.add_resource(ApproveProject, "/admin/projects/<int:project_id>/approve")
    api.add_resource(RejectProject, "/admin/projects/<int:project_id>/reject")
    api.add_resource(AdminUserList, "/admin/users")
    api.add_resource(UserList, "/users")
    api.add_resource(BrowseProjects, "/recruiters/projects")

    api.add_resource(MpesaPay, "/mpesa/pay")
    api.add_resource(MpesaCallback, "/mpesa/callback")

    @app.route("/")
    def home():
        return {"status": "API running"}, 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(port=5555, debug=True)
