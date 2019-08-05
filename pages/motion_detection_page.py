import json
from flask import Blueprint, render_template, url_for, request
from flask_cors import CORS, cross_origin
from processing import MotionDetection
from constants import *

md_page = Blueprint("motion_detection", __name__, template_folder="templates")
md = MotionDetection()

@md_page.route('/')
@cross_origin(support_credentials = True)
def show():
    return render_template('motion_detection.html')


@md_page.route('/start_algorithm')
@cross_origin(support_credentials = True)
def start_algorithm():
    response = {}
    md.start()
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@md_page.route('/stop_algorithm')
@cross_origin(support_credentials = True)
def stop_algorithm():
    response = {}
    md.stop()
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@md_page.route('/update_images')
@cross_origin(support_credentials = True)
def update_images():
    response = {'data':{}, 'code': 0, 'updated': md.new_data}
    # if len(md.raw_image_list) > 0:
    #     response['data']['current_raw_image'] = url_for('webapp',filename="static/raw_images/{}".format(md.raw_image_list[-1]))
    # else:
    #     response['data']['current_raw_image'] = ''
    # if len(md.thrsh_image_list) > 0:
    #     response['data']['current_thrsh_image'] = url_for('webapp',filename="static/thresholded_images/{}".format(md.thrsh_image_list[-1]))
    # else:
    #     response['data']['current_thrsh_image'] = ''
    if len(md.proc_image_list) > 0:
        response['data']['current_proc_images'] = [url_for('static', filename = "processed_images/{}".format(image_path)) for image_path in md.proc_image_list]
    else:
        response['data']['current_proc_images'] = ''
    return json.dumps(response)

@md_page.route('/tick')
@cross_origin(support_credentials = True)
def tock():
    response = {}
    response['code'] = HTTP_SUCCESS
    response['status'] = md.running
    return json.dumps(response)

@md_page.route('/download_raw_images')
@cross_origin(support_credentials = True)
def download_raw_images():
    response = {}
    response['data'] =  url_for('static', filename = md.archive_raw_images())
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@md_page.route('/download_processed_images')
@cross_origin(support_credentials = True)
def download_processed_images():
    response = {}
    response['data'] =  url_for('static', filename = md.archive_proc_images())
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@md_page.route('/get_settings')
@cross_origin(support_credentials = True)
def get_settings():
    response = {}
    response['data'] =  json.dumps(md.get_settings())
    response['code'] = HTTP_SUCCESS
    return json.dumps(response)

@md_page.route('/set_settings')
@cross_origin(support_credentials = True)
def set_settings():
    settings = json.loads(request.args.get('data'))
    md.set_settings(**settings)
    return json.dumps({'code': HTTP_SUCCESS})

def clean_up():
    md.clean_up()