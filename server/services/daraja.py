from __future__ import annotations
from dotenv import load_dotenv
load_dotenv()

from datetime import datetime, timezone, timedelta
import base64
import os
import requests
from typing import Optional, Tuple, Any, Dict

SANDBOX_BASE_URL = "https://sandbox.safaricom.co.ke"


def _get_env(name: str) -> Optional[str]:
   
    v = os.getenv(name)
    if v is None:
        return None
    v = v.strip()
    if v == "" or v == "...":
        return None
    return v

def _require_env() -> Tuple[str, str, str, str]:
    consumer_key = _get_env("MPESA_CONSUMER_KEY")
    consumer_secret = _get_env("MPESA_CONSUMER_SECRET")
    shortcode = _get_env("MPESA_SHORTCODE")
    passkey = _get_env("MPESA_PASSKEY")

    missing = []
    if not consumer_key:
        missing.append("MPESA_CONSUMER_KEY")
    if not consumer_secret:
        missing.append("MPESA_CONSUMER_SECRET")
    if not shortcode:
        missing.append("MPESA_SHORTCODE")
    if not passkey:
        missing.append("MPESA_PASSKEY")

    if missing:
        raise RuntimeError(f"Missing env vars: {', '.join(missing)}")

    return consumer_key, consumer_secret, shortcode, passkey


def _safe_json(res: requests.Response) -> Dict[str, Any]:
   
    try:
        data = res.json()
        if isinstance(data, dict):
            return data

        return {"data": data}
    except Exception:
        preview = (res.text or "").strip()
        if len(preview) > 1200:
            preview = preview[:1200] + "…"
        raise RuntimeError(
            f"Safaricom returned non-JSON. HTTP {res.status_code}. "
            f"Content-Type={res.headers.get('Content-Type')}. Body preview: {preview or '<empty body>'}"
        )

def get_access_token() -> str:
    consumer_key, consumer_secret, _, _ = _require_env()

    url = f"{SANDBOX_BASE_URL}/oauth/v1/generate?grant_type=client_credentials"

    res = requests.get(
        url,
        auth=(consumer_key, consumer_secret),
        headers={"Accept": "application/json"},
        timeout=30,
    )

    if res.status_code != 200:
        body = (res.text or "").strip()
        if len(body) > 1200:
            body = body[:1200] + "…"
        raise RuntimeError(f"OAuth failed. HTTP {res.status_code}. Body: {body or '<empty body>'}")

    data = _safe_json(res)

    token = data.get("access_token")
    if not token:
        raise RuntimeError(f"OAuth HTTP 200 but no access_token in response: {data}")

    return str(token)

def normalize_phone(phone: str) -> str:
    digits = "".join(c for c in str(phone) if c.isdigit())

    if digits.startswith("0"):
        digits = "254" + digits[1:]

    if digits.startswith("7"):
        digits = "254" + digits

    if not digits.startswith("254") or len(digits) < 12:
        raise ValueError(f"Invalid phone format after normalization: {digits}")

    return digits


def stk_push(phone: str, amount: int, callback_url: str, account_ref: str) -> Dict[str, Any]:
   
    if amount is None:
        raise ValueError("Amount is required")
    amount_int = int(amount)
    if amount_int <= 0:
        raise ValueError(f"Invalid amount: {amount_int} (must be > 0)")

    if not callback_url or not str(callback_url).startswith("http"):
        raise ValueError("Invalid callback_url (must be an http/https URL)")

    token = get_access_token()
    _, _, shortcode, passkey = _require_env()

    timestamp = (datetime.now(timezone.utc) + timedelta(hours=3)).strftime("%Y%m%d%H%M%S")
    password = base64.b64encode(f"{shortcode}{passkey}{timestamp}".encode()).decode()

    phone_norm = normalize_phone(phone)

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount_int,
        "PartyA": phone_norm,
        "PartyB": shortcode,
        "PhoneNumber": phone_norm,
        "CallBackURL": callback_url,
        "AccountReference": str(account_ref),
        "TransactionDesc": "Order Payment",
    }

    res = requests.post(
        f"{SANDBOX_BASE_URL}/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        timeout=30,
    )

    data = _safe_json(res)

    if res.status_code not in (200, 201):
        raise RuntimeError(f"STK push HTTP {res.status_code}. Response: {data}")

    if str(data.get("ResponseCode", "")) != "0":
        raise RuntimeError(f"STK push rejected. Response: {data}")

    return data
