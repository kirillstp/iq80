import os
import sys
from flask import Flask, render_template, Response, request
from pages.motion_detection_page import md_page, clean_up
import logging 
from logging.handlers import RotatingFileHandler


app = Flask("iq80")
# Register app blueprints
app.register_blueprint(md_page, url_prefix='/motion_detection')
# app.config['EXPLAIN_TEMPLATE_LOADING'] = True

@app.route('/')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    file_handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)        
    stream_handler = logging.StreamHandler(sys.stdout)
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    stream_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    app.logger.addHandler(file_handler)
    app.logger.addHandler(stream_handler)
    app.logger.setLevel(logging.DEBUG)
    try:
        app.logger.info("Starting Server...")
        app.run(port=80, host='0.0.0.0', use_reloader=False)
    except:
        clean_up()
        raise

