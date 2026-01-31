from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderMerchandise, Merchandise

class OrderList(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()

        total = 0
        order = Order(user_id=user_id, total_amount=0, status="pending")
        db.session.add(order)
        db.session.commit()

        for item in data["items"]:
            merchandise = Merchandise.query.get(item["merchandise_id"])

            if merchandise.stock < item["quantity"]:
                return {"error": "Insufficient stock"}, 400

            merchandise.stock -= item["quantity"]
            cost = merchandise.price * item["quantity"]
            total += cost

            order_item = OrderMerchandise(
                order_id=order.id,
                merchandise_id=merchandise.id,
                quantity=item["quantity"],
                price_at_purchase=merchandise.price
            )
            db.session.add(order_item)

        order.total_amount = total
        db.session.commit()

        return {"message": "Order placed", "total": float(total)}, 201
