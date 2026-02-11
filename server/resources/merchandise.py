from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Merchandise, User, OrderMerchandise


def require_admin():
    raw_id = get_jwt_identity()
    try:
        user_id = int(raw_id)
    except (TypeError, ValueError):
        return None, ({"error": "Invalid token identity. Please log in again."}, 401)

    user = User.query.get(user_id)
    if not user:
        return None, ({"error": "Invalid token user. Please log in again."}, 401)

    if not user.role or user.role.name != "admin":
        return None, ({"error": "Admin access required"}, 403)

    return user, None


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
        user, err = require_admin()
        if err:
            return err

        data = request.get_json(silent=True) or {}

        if not data.get("name"):
            return {"error": "Missing name"}, 400
        if "price" not in data:
            return {"error": "Missing price"}, 400
        if "stock" not in data:
            return {"error": "Missing stock"}, 400

        item = Merchandise(
            name=str(data.get("name")).strip(),
            description=(data.get("description") or "").strip(),
            price=data.get("price"),
            stock=data.get("stock"),
            image_url=(data.get("image_url") or "").strip(),
        )

        db.session.add(item)
        db.session.commit()

        return {"message": "Merchandise added"}, 201


class MerchandiseItem(Resource):
    @jwt_required()
    def patch(self, id):
        user, err = require_admin()
        if err:
            return err

        item = Merchandise.query.get_or_404(id)
        data = request.get_json(silent=True) or {}

        if "name" in data:
            item.name = str(data["name"]).strip()
        if "description" in data:
            item.description = (data["description"] or "").strip()
        if "price" in data:
            item.price = data["price"]
        if "stock" in data:
            item.stock = data["stock"]
        if "image_url" in data:
            item.image_url = (data["image_url"] or "").strip()

        db.session.commit()
        return {"message": "Merchandise updated"}, 200

    @jwt_required()
    def delete(self, id):
        user, err = require_admin()
        if err:
            return err

        item = Merchandise.query.get_or_404(id)

        OrderMerchandise.query.filter_by(merchandise_id=item.id).delete(synchronize_session=False)

        db.session.delete(item)
        db.session.commit()
        return {"message": "Merchandise deleted"}, 200

