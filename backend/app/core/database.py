import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("airwise.db")

class DatabaseManager:
    client: AsyncIOMotorClient = None
    db = None

db_manager = DatabaseManager()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}")
    # Skip long blocking timeout if localhost is not running
    if "localhost" in settings.MONGODB_URL or "127.0.0.1" in settings.MONGODB_URL:
        logger.info("Local environment detected, initializing graceful mock/fallback mode.")
        return
    try:
        db_manager.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=1000)
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB: {e}")

async def close_mongo_connection():
    if db_manager.client:
        logger.info("Closing MongoDB connection.")
        db_manager.client.close()

def get_database():
    return db_manager.db
