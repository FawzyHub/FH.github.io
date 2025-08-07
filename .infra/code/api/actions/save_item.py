from common.common_logger import main as logger
logger = logger()

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
