from common.common_logger import main as logger
logger = logger()

from common._auth import decode_token

import json
import boto3
from common.api import success_response, error_response, default_json

dynamo_client = boto3.resource("dynamodb")
menu_table = dynamo_client.Table("fz-menu-table")

def main(event):
    try:
        logger.info(f"FETCH menu items, EVENT RECEIVED: {event}")
        
        # Get the item data from the event body
        if event['headers']['origin'] != 'https://fawzyhotels.com':
            if 'body' not in event:
                raise ValueError("No body found in event")
                
            body = json.loads(event['body']) 
            
            token = body.get('token')
            if not token:
                error_response["statusCode"] = 400
                error_response["body"] = json.dumps({"response": "Token is required"})
                return error_response
            # Decode the token to verify user
            try:
                decoded = decode_token(token, "some-random-secret-36154861tyugfudysgfudsa")
                if not decoded or 'userId' not in decoded:
                    error_response["statusCode"] = 403
                    error_response["body"] = json.dumps({"response": "Invalid token"})
                    return error_response
            except Exception as e:
                print("error decoding token", str(e))
                error_response["statusCode"] = 403
                error_response["body"] = json.dumps({"response": "Invalid token"})
                return error_response    
        
        # Perform a scan operation on the menu table
        response = menu_table.scan()
        items = response['Items']
        
        # Get all items if there are more (pagination)
        while 'LastEvaluatedKey' in response:
            response = menu_table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response['Items'])

        success_response["body"] = json.dumps({"response": items}, default=default_json)
        return success_response

    except Exception as e:
        print("error ==>", str(e))
        error_response["body"] = json.dumps({"response": "error fetching menu items"})
        return error_response
