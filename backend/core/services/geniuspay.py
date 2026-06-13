import requests
import json
import hmac
import hashlib
from django.conf import settings

class GeniusPayService:
    BASE_URL = "http://pay.genius.ci/api/v1/merchant"

    def __init__(self):
        # We use standard sandbox keys as defined in the plan
        self.api_key = getattr(settings, 'GENIUSPAY_API_KEY', 'pk_sandbox_xJuRi1kLCATOAh1e3BGwWrcF1NRRbuUj')
        self.api_secret = getattr(settings, 'GENIUSPAY_API_SECRET', 'sk_sandbox_2b81d8aa34c9b0935a4712e3af996a5d8c6276fc0a9932d1a3d27334a28d3662')
        self.webhook_secret = getattr(settings, 'GENIUSPAY_WEBHOOK_SECRET', 'whsec_test_secret_change_me')
        self.frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')

    def initiate_payment(self, amount, description, customer_data=None, metadata=None, payment_id=None, reference=None):
        """
        Initie un paiement et retourne l'URL de checkout (Mode Checkout recommandé)
        """
        headers = {
            "X-API-Key": self.api_key,
            "X-API-Secret": self.api_secret,
            "Content-Type": "application/json"
        }
        
        success_url = f"{self.frontend_url}/success"
        error_url = f"{self.frontend_url}/cancel"
        
        if payment_id and reference:
            query_params = f"?payment_id={payment_id}&reference={reference}"
            success_url += query_params
            error_url += f"{query_params}&status=failed"

        payload = {
            "amount": int(amount),
            "description": description[:500] if description else "Paiement Rosyta Content Studio",
            "success_url": success_url,
            "error_url": error_url,
            "return_url": success_url,
            "cancel_url": error_url,
            "callback_url": success_url,
        }
        
        if customer_data:
            payload["customer"] = customer_data
            
        if metadata:
            payload["metadata"] = metadata

        print(f"[PAYMENT_INIT] Payload: {json.dumps(payload)}")

        try:
            response = requests.post(
                f"{self.BASE_URL}/payments",
                headers=headers,
                json=payload,
                timeout=15
            )
            data = response.json()
            if response.status_code in [200, 201] and data.get("success"):
                return data.get("data", {})
            else:
                error_msg = data.get("error", {}).get("message", "Erreur inconnue de GeniusPay")
                print(f"GeniusPay Error: {response.status_code} - {data}")
                return {"error": error_msg}
        except Exception as e:
            print(f"GeniusPay Exception: {str(e)}")
            return {"error": str(e)}

    def verify_webhook_signature(self, signature, payload_raw, payload_dict, timestamp):
        """
        Vérifie la signature HMAC SHA-256 du webhook envoyé par GeniusPay
        Teste à la fois avec le corps brut (recommandé pour la sécurité stricte)
        et avec le corps re-sérialisé (si GeniusPay l'exige spécifiquement).
        """
        try:
            # Test 1: Selon la documentation (re-sérialisation)
            payload_str = json.dumps(payload_dict, separators=(',', ':'))
            data1 = f"{timestamp}.{payload_str}"
            expected1 = hmac.new(
                self.webhook_secret.encode('utf-8'),
                data1.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            # Test 2: Le raw body directement (plus standard)
            data2 = f"{timestamp}.{payload_raw}"
            expected2 = hmac.new(
                self.webhook_secret.encode('utf-8'),
                data2.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()

            print(f"DEBUG HMAC Test 1 (Docs): {expected1}")
            print(f"DEBUG HMAC Test 2 (Raw): {expected2}")
            print(f"DEBUG Webhook Secret used: {self.webhook_secret[:5]}...{self.webhook_secret[-5:]} (Length: {len(self.webhook_secret)})")

            return hmac.compare_digest(signature, expected1) or hmac.compare_digest(signature, expected2)
        except Exception as e:
            print(f"Erreur vérification signature: {e}")
            return False
