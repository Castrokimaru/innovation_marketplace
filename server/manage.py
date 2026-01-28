from app import app, db
from flask_migrate import Migrate
from flask.cli import FlaskGroup

# Initialize migrate
migrate = Migrate(app, db)

# Create a CLI group
cli = FlaskGroup(app)

if __name__ == "__main__":
    cli()
