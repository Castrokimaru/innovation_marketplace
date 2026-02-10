from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone, timedelta
import base64
import requests
import os


CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
SHORTCODE = os.getenv("MPESA_SHORTCODE")  
PASSKEY = os.getenv("MPESA_PASSKEY")     

SANDBOX_BASE_URL = "https://sandbox.safaricom.co.ke"

def get_access_token():
    auth = base64.b64encode(f"{CONSUMER_KEY}:{CONSUMER_SECRET}".encode()).decode()
    url = f"{SANDBOX_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(url, headers={"Authorization": f"Basic {auth}"})
    data = response.json()
    print("Access token response:", data)
    if "access_token" not in data:
        raise Exception(f"Failed to get access token: {data}")
    return data["access_token"]

def stk_push(phone, amount, callback_url, account_ref):
    token = get_access_token()

  
    timestamp = (datetime.now(timezone.utc) + timedelta(hours=3)).strftime("%Y%m%d%H%M%S")

    password = base64.b64encode(f"{SHORTCODE}{PASSKEY}{timestamp}".encode()).decode()

    if phone.startswith("0"):
        phone = "254" + phone[1:]

    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": SHORTCODE,
        "PhoneNumber": phone,
        "CallBackURL": callback_url,
        "AccountReference": account_ref,
        "TransactionDesc": "Order Payment"
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    res = requests.post(
        f"{SANDBOX_BASE_URL}/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers=headers
    )

    print("STK RESPONSE:", res.text)
    return res.json()