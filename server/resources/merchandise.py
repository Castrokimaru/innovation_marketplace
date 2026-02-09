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
                "description": m.description,   
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

class MerchandiseItem(Resource):
    @jwt_required()
    def patch(self, id):
        item = Merchandise.query.get_or_404(id)
        data = request.get_json()

        if "name" in data:
            item.name = data["name"]
        if "description" in data:
            item.description = data["description"]
        if "price" in data:
            item.price = data["price"]
        if "stock" in data:
            item.stock = data["stock"]
        if "image_url" in data:
            item.image_url = data["image_url"]

        db.session.commit()
        return {"message": "Merchandise updated"}, 200
    
    @jwt_required()
    def delete(self, id):
        item = Merchandise.query.get_or_404(id)
        db.session.delete(item)
        db.session.commit()
        return {"message": "Merchandise deleted"}, 200