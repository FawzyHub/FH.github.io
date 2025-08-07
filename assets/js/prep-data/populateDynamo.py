import boto3
import uuid
import json

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('fz-menu-table')  # Replace with your table name

# Sample items list
items = open('./menuItems.json', 'r')
items = json.load(items)

# Function to populate items into DynamoDB
def populate_items(items_list):
    for item in items_list:
        # Generate unique ID for each item
        item['hashKey'] = str(uuid.uuid4())
        
        # Put item into DynamoDB table
        try:
            table.put_item(Item=item)
            print(f"Successfully added item: {item['item']}")
        except Exception as e:
            print(f"Error adding item {item['item']}: {str(e)}")

if __name__ == "__main__":
    populate_items(items)
    print("Data population complete")
