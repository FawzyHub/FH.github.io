from common.common_logger import main as logger
logger = logger()

import json
import boto3
from common.api import success_response, error_response, default_json
from common._auth import create_token
from datetime import timedelta

CORRECT_PASSWORD = "FawzyMenuChange2017"

def main(event):
    try:
        logger.info(f"AUTH CHECK, EVENT RECEIVED: {event}")
        
        # Extract password from the event body
        body = json.loads(event.get('body', '{}'))
        password = body.get('password')

        if not password:
            error_response["statusCode"] = 400
            error_response["body"] = json.dumps({"response": "Password is required"})
            return error_response

        # Check if password matches
        if password == CORRECT_PASSWORD:
            token = create_token({"userId": "fz-staff"}, "some-random-secret-36154861tyugfudysgfudsa", timedelta(seconds=1800))
            success_response["body"] = json.dumps({"response": "Authentication successful", "token": token})
            return success_response
        else:
            error_response["statusCode"] = 403
            error_response["body"] = json.dumps({"response": "Access denied"})
            return error_response

    except Exception as e:
        print("error ==>", str(e))
        error_response["statusCode"] = 500
        error_response["body"] = json.dumps({"response": "Internal server error"})
        return error_response
