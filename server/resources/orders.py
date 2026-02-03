from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Order, OrderMerchandise, Merchandise


class OrderCreate(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json()

        order = Order(
            user_id=user_id,
            total_amount=0,
            status="pending"
        )

        db.session.add(order)
        db.session.commit()

        total = 0

        for item in data["items"]:
            merch = Merchandise.query.get(item["merchandise_id"])
            if not merch or merch.stock < item["quantity"]:
                return {"error": "Invalid or out-of-stock item"}, 400

            merch.stock -= item["quantity"]
            cost = merch.price * item["quantity"]
            total += cost

            order_item = OrderMerchandise(
                order_id=order.id,
                merchandise_id=merch.id,
                quantity=item["quantity"],
                price_at_purchase=merch.price
            )

            db.session.add(order_item)

        order.total_amount = total
        db.session.commit()

        return {
            "order_id": order.id,
            "total": float(total)
        }, 201

class OrderDelete(Resource):
    @jwt_required()
    def delete(self, order_id):
        user_id = int(get_jwt_identity())

        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404

        if order.user_id != user_id:
            return {"error": "Unauthorized"}, 403

        if order.status != "pending":
            return {"error": "Order cannot be deleted"}, 400

        for item in order.items:
            item.merchandise.stock += item.quantity

        order.status = "cancelled"
        db.session.commit()

        return {"message": "Order cancelled"}, 200
