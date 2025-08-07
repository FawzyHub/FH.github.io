from common.common_logger import main as logger
logger = logger()

import json
import boto3
from common.api import success_response, error_response, default_json

dynamo_client = boto3.resource("dynamodb")
menu_table = dynamo_client.Table("fz-menu-table")

def main(event):
    try:
        logger.info(f"FETCH menu items, EVENT RECEIVED: {event}")
        
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
