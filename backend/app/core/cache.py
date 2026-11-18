import time
from typing import Dict, Any, Optional

class SimpleTTLCache:
    """High-performance thread-safe in-memory TTL cache to reduce external API overhead."""
    def __init__(self, default_ttl: int = 300):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._default_ttl = default_ttl

    def get(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if not entry:
            return None
        if time.time() > entry["expires_at"]:
            self._cache.pop(key, None)
            return None
        return entry["data"]

    def set(self, key: str, data: Any, ttl: Optional[int] = None) -> None:
        duration = ttl if ttl is not None else self._default_ttl
        self._cache[key] = {
            "data": data,
            "expires_at": time.time() + duration
        }

    def clear(self) -> None:
        self._cache.clear()

aqi_cache = SimpleTTLCache(default_ttl=300)
