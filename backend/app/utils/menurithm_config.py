import os
from typing import Dict, List

def check_menurithm_config() -> Dict:
    """Check Menurithm integration configuration"""
    config_status = {
        "configured": True,
        "missing_variables": [],
        "warnings": []
    }
    
    required_vars = [
        "MENURITHM_API_URL",
        "MENURITHM_API_KEY"
    ]
    
    optional_vars = [
        "MENURITHM_WEBHOOK_SECRET"
    ]
    
    for var in required_vars:
        if not os.getenv(var):
            config_status["configured"] = False
            config_status["missing_variables"].append(var)
    
    for var in optional_vars:
        if not os.getenv(var):
            config_status["warnings"].append(f"Optional variable {var} not set - webhook verification disabled")
    
    # Check if API key looks valid (basic check)
    api_key = os.getenv("MENURITHM_API_KEY")
    if api_key and len(api_key) < 10:
        config_status["warnings"].append("MENURITHM_API_KEY appears to be too short")
    
    return config_status

def get_menurithm_config() -> Dict:
    """Get current Menurithm configuration (without sensitive data)"""
    return {
        "api_url": os.getenv("MENURITHM_API_URL", "Not configured"),
        "api_key_configured": bool(os.getenv("MENURITHM_API_KEY")),
        "webhook_secret_configured": bool(os.getenv("MENURITHM_WEBHOOK_SECRET")),
        "config_status": check_menurithm_config()
    }
