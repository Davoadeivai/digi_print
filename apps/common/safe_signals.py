import importlib
import logging

logger = logging.getLogger(__name__)

def safe_import(signals_module_path: str):
    """
    Safely import signals modules.
    Prevents Django startup crash if model imports are broken.
    """
    try:
        importlib.import_module(signals_module_path)
        logger.info(f"✅ Signals loaded: {signals_module_path}")
    except ImportError as e:
        logger.warning(
            f"⚠️ Signals NOT loaded ({signals_module_path}): {e}"
        )
