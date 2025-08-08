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
        logger.info(f"SAVE menu item, EVENT RECEIVED: {event}")
        
        # Get the item data from the event body
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
        
        # Save the item to DynamoDB
        menu_table.put_item(Item={
            'hashKey': body['hashKey'],
            'category': body['category'],
            'item': body['item'],
            'subCategory': body['subCategory'],
            'description': body['description'],
            'price': body['price']
        })

        success_response["body"] = json.dumps({"response": "Item saved successfully"}, default=default_json)
        return success_response

    except Exception as e:
        print("error ==>", str(e))
        error_response["body"] = json.dumps({"response": f"Error saving menu item: {str(e)}"})
        return error_response
