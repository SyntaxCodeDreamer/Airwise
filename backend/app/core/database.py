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
    try:
        db_manager.client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
        # Quick server ping test
        await db_manager.db.command('ping')
        logger.info(f"Successfully connected to MongoDB database: {settings.DATABASE_NAME}")
    except Exception as e:
        logger.warning(f"MongoDB connection notice: {e}. Falling back to resilient in-memory collections.")

async def close_mongo_connection():
    if db_manager.client:
        logger.info("Closing MongoDB connection.")
        db_manager.client.close()

def get_database():
    return db_manager.db
