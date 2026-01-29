from flask import Flask
from flask_migrate import Migrate
from models import db

app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///moringa.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db.init_app(app)
migrate = Migrate(app, db)


@app.route("/")
def index():
    return {"status": "ok"}


from models import User, UserRole, Project, UserProject, Category, ProjectCategory, Merchandise, Order, OrderMerchandise
