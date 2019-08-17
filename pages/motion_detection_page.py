import json
import logging
from flask import Blueprint, render_template, url_for, request
from flask_cors import CORS, cross_origin
from processing import get_md
from constants import *

logger = logging.getLogger('iq80')

md_page = Blueprint("motion_detection", __name__, template_folder="templates")

def log_errors(func):
    def wrapper(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception as e:
            logger.error(e)
    return wrapper

@log_errors
@md_page.route('/')
@cross_origin(support_credentials = True)
def show():
    return render_template('motion_detection.html')

@log_errors
@md_page.route('/start_algorithm')
@cross_origin(support_credentials = True)
def start_algorithm():
    md = get_md()
    logger.info("Starting motion detection algorithm...")
    response = {}
    logger.debug("Module {}".format(md))
    md.start()
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@log_errors
@md_page.route('/stop_algorithm')
@cross_origin(support_credentials = True)
def stop_algorithm():
    md = get_md()
    logger.info("Stopping motion detection algorithm...")
    response = {}
    md.stop()
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@log_errors
@md_page.route('/update_images')
@cross_origin(support_credentials = True)
def update_images():
    md = get_md()
    response = {'data':{}, 'code': 0, 'updated': md.new_data}
    if len(md.proc_image_list) > 0:
        response['data']['current_proc_images'] = [url_for('static', filename = "processed_images/{}".format(image_path)) for image_path in md.proc_image_list]
    else:
        response['data']['current_proc_images'] = ''
    return json.dumps(response)

@log_errors
@md_page.route('/tick')
@cross_origin(support_credentials = True)
def tock():
    md = get_md()
    response = {}
    response['code'] = HTTP_SUCCESS
    response['status'] = md.running
    return json.dumps(response)

@log_errors
@md_page.route('/download_raw_images')
@cross_origin(support_credentials = True)
def download_raw_images():
    md = get_md()
    response = {}
    response['data'] =  url_for('static', filename = md.archive_raw_images())
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@log_errors
@md_page.route('/download_processed_images')
@cross_origin(support_credentials = True)
def download_processed_images():
    md = get_md()
    response = {}
    response['data'] =  url_for('static', filename = md.archive_proc_images())
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@log_errors
@md_page.route('/get_settings')
@cross_origin(support_credentials = True)
def get_settings():
    md = get_md()
    response = {}
    response['data'] =  json.dumps(md.get_settings())
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@log_errors
@md_page.route('/set_settings')
@cross_origin(support_credentials = True)
def set_settings():
    md = get_md()
    settings = json.loads(request.args.get('data'))
    md.set_settings(**settings)
    return json.dumps({'code': HTTP_SUCCESS})

@log_errors
def clean_up():
    md = get_md()
    md.clean_up()