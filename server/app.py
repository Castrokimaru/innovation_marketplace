from flask import Flask, request, make_response
from flask_migrate import Migrate
from flask_restful import Api, Resource # Enfocing RESTFul principles
from flask_cors import CORS
from flask_bcrypt import bcrypt
from resources.merchandise import MerchandiseList

from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity,
    set_access_cookies, unset_jwt_cookies
)
from models import db, User, UserRole, Project, UserProject, Category, ProjectCategory, Merchandise, Order, OrderMerchandise


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False


app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # or True with CSRF token



CORS(app, resources={
    r"/*": {
        "origins": [
            "*"
        ]
    }
}
)
migrate = Migrate(app, db)
db.init_app(app)

api = Api(app) # we link our flask app to flaks_restful



class Login(Resource):
    def post(self):
        data = request.get_json()
        password = data["password"]
        email = data["email"]

        # user = User.query.filter_by(email=email).first()
        # if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash):
        #     access_token = create_access_token(identity=email) #gerate JWT
        #     response = make_response(f"Welcome {user.username}")
        #     set_access_cookies(response, access_token) # save JWT in httponly cookies
        #     return response        
        # return make_response(f"Invalid credentials!")

        return make_response({
            "id": 1,
            "email": email,
            "username": "Tomashi"
        }, 200)
    


api.add_resource(Login, '/login')
api.add_resource(MerchandiseList, "/merchandise")





if __name__ == '__main__':
    app.run(port=5555, debug=True)


