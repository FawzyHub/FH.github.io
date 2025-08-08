from common.common_logger import main as logger
from actions.list_items import main as list_items
from actions.save_item import main as save_item
from actions.auth_check import main as auth_check

actions_map = {
    "/v1/list/items" : list_items,
    "/v1/save/item" : save_item,
    "/v1/auth/check" : auth_check
}

logger = logger()
def handler(event, context):
    
    logger.info(f"ORIGINAL API EVENT: {event}")
    
    if "path" not in event:
        print("no path in event, exiting early")
        return
    
    path = event["path"]
    if path not in actions_map:
        raise Exception (f"unrecognized path {path} provided")
    return actions_map[path](event)
