from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Order, OrderMerchandise, Merchandise


class OrderCreate(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        items = data.get("items") if isinstance(data, dict) else data
        if not isinstance(items, list) or len(items) == 0:
            return {"error": "No items provided"}, 400

        order = Order(user_id=user_id, total_amount=0, status="pending")
        db.session.add(order)
        db.session.commit() 

        total = 0

        for item in items:
            merch_id = item.get("merchandise_id")
            qty = item.get("quantity")

            if not merch_id or not qty or int(qty) <= 0:
                return {"error": "Invalid item payload"}, 400

            merch = Merchandise.query.get(int(merch_id))
            if not merch or (merch.stock is not None and merch.stock < int(qty)):
                return {"error": "Invalid or out-of-stock item"}, 400

            if merch.stock is not None:
                merch.stock -= int(qty)

            cost = float(merch.price) * int(qty)
            total += cost

            order_item = OrderMerchandise(
                order_id=order.id,
                merchandise_id=merch.id,
                quantity=int(qty),
                price_at_purchase=merch.price,
            )
            db.session.add(order_item)

        order.total_amount = total
        db.session.commit()

        return {"order_id": order.id, "total": float(total), "status": order.status}, 201

class OrderDetail(Resource):
    @jwt_required()
    def get(self, order_id):
        user_id = int(get_jwt_identity())
        order = Order.query.get(order_id)
        if not order:
            return {"error": "Order not found"}, 404
        if order.user_id != user_id:
            return {"error": "Unauthorized"}, 403

        return {
            "order_id": order.id,
            "status": order.status,
            "total": float(order.total_amount or 0),
            "payment_method": getattr(order, "payment_method", None),
            "checkout_request_id": getattr(order, "checkout_request_id", None),
            "mpesa_receipt": getattr(order, "mpesa_receipt", None),
        }, 200

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
            if item.merchandise and item.merchandise.stock is not None:
                item.merchandise.stock += item.quantity

        order.status = "cancelled"
        db.session.commit()

        return {"message": "Order cancelled"}, 200
