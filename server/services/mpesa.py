from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required
from services.daraja import stk_push
from models import db, Order

class MpesaPay(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        phone = data["phone"]
        order_id = data["order_id"]

        order = Order.query.get(order_id)
        if not order or order.status != "pending":
            return {"error": "Invalid order"}, 400

        response = stk_push(
            phone=phone,
            amount=int(order.total_amount),
            callback_url="https://overstalely-piceous-alia.ngrok-free.dev/mpesa/callback",
            account_ref=str(order.id)
        )

        order.payment_method = "mpesa"
        order.checkout_request_id = response.get("CheckoutRequestID")
        db.session.commit()

        return {"message": "STK push sent"}, 200
class MpesaCallback(Resource):
    def post(self):
        data = request.get_json()
        callback = data["Body"]["stkCallback"]

        if callback["ResultCode"] == 0:
            metadata = callback["CallbackMetadata"]["Item"]
            receipt = next(
                i["Value"] for i in metadata
                if i["Name"] == "MpesaReceiptNumber"
            )

            order = Order.query.filter_by(
                checkout_request_id=callback["CheckoutRequestID"]
            ).first()

            order.status = "paid"
            order.mpesa_receipt = receipt
            db.session.commit()

        return {"ResultCode": 0, "ResultDesc": "Accepted"}
