from flask import Flask
from flask_migrate import Migrate
from models import db  # import the db from models.py (with metadata)

app = Flask(__name__)

# Database config
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///moringa.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Attach models' db to Flask app
db.init_app(app)
migrate = Migrate(app, db)

# Optional test route
@app.route("/")
def index():
    return {"status": "ok"}

# Import models so migrations see them
from models import User, UserRole, Project, UserProject, Category, ProjectCategory, Merchandise, Order, OrderMerchandise
