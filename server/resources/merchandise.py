# from flask_restful import Resource
# from flask import request
# from models import db, Merchandise

# class MerchandiseList(Resource):
#     def post(self):
#         data = request.get_json()

#         item = Merchandise(
#             name=data["name"],
#             description=data["description"],
#             price=data["price"],
#             stock=data["stock"],
#             image_url=data["image_url"]
#         )
#         db.session.add(item)
#         db.session.commit()

#         return {"message": "Merchandise added"}, 201

#     def get(self):
#         items = Merchandise.query.all()
#         return [
#             {
#                 "id": m.id,
#                 "name": m.name,
#                 "price": float(m.price),
#                 "stock": m.stock
#             } for m in items
#         ], 200
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required

from models import db, Merchandise


class MerchandiseList(Resource):
    def get(self):
        items = Merchandise.query.all()
        return [
            {
                "id": m.id,
                "name": m.name,
                "price": float(m.price),
                "stock": m.stock,
                "image_url": m.image_url
            } for m in items
        ], 200

    @jwt_required()
    def post(self):
        data = request.get_json()

        item = Merchandise(
            name=data["name"],
            description=data["description"],
            price=data["price"],
            stock=data["stock"],
            image_url=data["image_url"],
        )

        db.session.add(item)
        db.session.commit()

        return {"message": "Merchandise added"}, 201
