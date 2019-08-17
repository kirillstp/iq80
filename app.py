import os
import sys
import json
from flask import Flask, render_template, Response, request, redirect, url_for
from flask_cors import CORS, cross_origin
from pages.motion_detection_page import md_page, clean_up
import logging 
from logging.handlers import RotatingFileHandler


app = Flask("iq80", static_folder = 'webapp/dist',static_url_path = '/static',  template_folder='webapp/public')
# Register app blueprints
app.register_blueprint(md_page, url_prefix='/motion_detection')
CORS(app, support_credentials = True)
# app.config['EXPLAIN_TEMPLATE_LOADING'] = True
file_handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)        
stream_handler = logging.StreamHandler(sys.stdout)
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
stream_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger = logging.getLogger('iq80')
logger.addHandler(file_handler)
logger.addHandler(stream_handler)
logger.setLevel(logging.DEBUG)
logger.info("Logger setup..")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/camera')
def redirect_to_index():
    return redirect(url_for('index'))

@app.route('/auth')
def authorize():
    response = {}
    if request.args['keycode'] == "80,76,85,77,80,83,65,68,73,69":
        response['locked'] = False
    else:
        response['locked'] = True
    return json.dumps(response)



# if __name__ == '__main__':
#     try:
#         app.run(port=80, host='0.0.0.0', use_reloader=False)
#     except:
#         clean_up()
#         raise

