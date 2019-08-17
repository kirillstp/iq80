from app import app 
import logging
from pages.motion_detection_page import clean_up

logger = logging.getLogger('iq80')
logger.info("Entry point - uwsgi...")

if __name__ == "__main__":

    try:
        app.run()
    except Exception as e:
        loggger.error(e)
        clean_up()
        raise