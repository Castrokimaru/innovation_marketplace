from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from models import db


from resources.auth import Signup, Login
from resources.projects import ProjectList
from resources.merchandise import MerchandiseList
from resources.orders import OrderCreate


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "dev-secret-key" 

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app)

    api = Api(app)


    api.add_resource(Signup, "/signup")
    api.add_resource(Login, "/login")

    api.add_resource(ProjectList, "/projects")
    api.add_resource(MerchandiseList, "/merchandise")
    api.add_resource(OrderCreate, "/orders")


    @app.route("/")
    def home():
        return {"status": "API running"}, 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(port=5555, debug=True)
