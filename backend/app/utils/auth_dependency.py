from fastapi import HTTPException, Header
from firebase_admin import auth as firebase_auth
import app.utils.auth 


def verify_firebase_token(authorization: str = Header(...)):
    print(f"🔑 Auth header received: {authorization[:20]}..." if authorization else "❌ No auth header")
    
    if not authorization.startswith("Bearer "):
        print("❌ Invalid authorization header format")
        raise HTTPException(status_code=403, detail="Invalid authorization header format")
    
    token = authorization.split(" ")[1]
    print(f"🎫 Token extracted: {token[:20]}...")
    
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        print(f"✅ Token verified for user: {decoded_token.get('uid', 'unknown')}")
        return decoded_token  # contains 'uid', 'email', etc.
    except Exception as e:
        print("❌ Token verification error:", repr(e))
        raise HTTPException(status_code=403, detail=f"Invalid token: {str(e)}")