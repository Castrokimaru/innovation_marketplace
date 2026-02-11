from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

from services.daraja import stk_push
from models import db, Order


class MpesaPay(Resource):
    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())
        data = request.get_json(silent=True) or {}

        phone = data.get("phone")
        order_id = data.get("order_id")

        print("MPESA /pay payload:", data)  

        if not phone or not order_id:
            return {"error": "phone and order_id are required", "got": data}, 400

        order = Order.query.get(int(order_id))
        if not order:
            return {"error": "Invalid order (not found)", "order_id": order_id}, 400

        status = (order.status or "").lower().strip()
        if status not in ("pending", "unpaid"):
            return {"error": "Invalid order (status not payable)", "status": order.status}, 400

        if order.user_id != user_id:
            return {"error": "Unauthorized"}, 403

        callback_url = os.getenv("MPESA_CALLBACK_URL")
        if not callback_url:
            return {"error": "MPESA_CALLBACK_URL not configured"}, 500

        amount = int(getattr(order, "total_amount", 0) or getattr(order, "total", 0) or 0)
        if amount <= 0:
            return {"error": "Order total is invalid", "amount": amount}, 400

        try:
            response = stk_push(
                phone=phone,
                amount=amount,
                callback_url=callback_url,
                account_ref=str(order.id),
            )
        except Exception as e:
            return {"error": "M-Pesa service error", "details": str(e)}, 502

        if response.get("ResponseCode") != "0":
            return {"error": "STK push failed", "details": response}, 400

        order.payment_method = "mpesa"
        order.checkout_request_id = response.get("CheckoutRequestID")
       
        db.session.commit()

        return {
            "message": "STK push sent",
            "checkout_request_id": order.checkout_request_id,
            "merchant_request_id": response.get("MerchantRequestID"),
        }, 200


class MpesaCallback(Resource):
    def post(self):
        data = request.get_json(silent=True) or {}
        stk = (data.get("Body") or {}).get("stkCallback") or {}

        result_code = stk.get("ResultCode")
        checkout_id = stk.get("CheckoutRequestID")

        if not checkout_id:
            return {"ResultCode": 0, "ResultDesc": "Accepted"}, 200

        order = Order.query.filter_by(checkout_request_id=checkout_id).first()
        if not order:
            return {"ResultCode": 0, "ResultDesc": "Accepted"}, 200

        if str(result_code) == "0":
            metadata = (stk.get("CallbackMetadata") or {}).get("Item", [])
            receipt = None
            for item in metadata:
                if item.get("Name") == "MpesaReceiptNumber":
                    receipt = item.get("Value")
                    break

            order.status = "paid"
            order.mpesa_receipt = receipt
        else:
            order.status = "failed"

        db.session.commit()
        return {"ResultCode": 0, "ResultDesc": "Accepted"}, 200
