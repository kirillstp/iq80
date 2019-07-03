import os
import cv2
import time
import numpy
import logging
import datetime
import threading
from collections import OrderedDict
from .images import ImageCollection
from modules import get_camera

class MotionDetection():
    RAW_SAVE_DIR = 'raw_images'
    PROC_SAVE_DIR = 'processed_images'
    THRSH_SAVE_DIR = 'thresholded_images'
    BGN_SAVE_DIR = 'bgn_images'
    def __init__(self):
        # import pdb;pdb.set_trace()
        self.logger  = logging.getLogger("iq80.motion_detection")
        self.logger.info("Starting motion detection module...")
        raw_image_path = os.path.join(os.getcwd(),"webapp","dist", self.RAW_SAVE_DIR)  
        proc_image_path = os.path.join(os.getcwd(),"webapp","dist", self.PROC_SAVE_DIR)  
        bgn_image_path = os.path.join(os.getcwd(),"webapp", "dist",self.BGN_SAVE_DIR)  
        thrsh_image_path = os.path.join(os.getcwd(),"webapp","dist",self.THRSH_SAVE_DIR)
        self.raw_images = ImageCollection('raw_images', raw_image_path, limit = 5)
        self.bgn_image = ImageCollection('bgn_image', bgn_image_path, limit = 1)
        self.thrsh_image = ImageCollection('thrsh_image', thrsh_image_path, limit = 1)
        self.proc_images = ImageCollection('proc_images', proc_image_path, limit = 1000)
        self.camera = get_camera(new_image_path = self.raw_images.path)
        self.set_consistent_capture()
        self.seconds_per_loop = 0.5 # minimum seconds between start of new image
        self.algorithm_execution_time = []
        # algorithm configuration
        self.quality_threshold = 50
        self.min_contour_area = 500
        self.lock = threading.Lock()
        self.binary_threshold = 0 
        self.run = False
        self.gaussian_filter_area = (5,5)

    def set_settings(self, min_raw_images, quality_threshold, min_contour_area, gaussian_filter_area):
        self.lock.acquire()
        print("Setting settings. min_raw_images: {}, quality_threshold: {}, min_contour_area: {}, gaussian_filter: {}")
        self.quality_threshold = int(quality_threshold)
        self.min_contour_area = int(min_contour_area)
        self.raw_images = ImageCollection('raw_images', self.raw_images.path, limit = int(min_raw_images))
        self.gaussian_filter_area = (int(gaussian_filter_area),int(gaussian_filter_area))
        self.lock.release()
   
    def get_settings(self):
        return ({
            "quality_threshold" : self.quality_threshold,
            "min_contour_area"  : self.min_contour_area,
            "min_raw_images"    : self.raw_images.limit,
            "gaussian_filter_area" : self.gaussian_filter_area[0]
        })

    def capture(self):
        filename = self.camera.capture()
        print("Image saved {}".format(filename))
        return filename

    def clean_up(self):
        self.camera.clean_up()
    
    def set_consistent_capture(self):
        self.camera.iso = 200
        self.camera.shutter_speed = self.camera.exposure_speed
        self.camera.turn_off_exposure_mode()
        self.camera.turn_off_awb()

    def start(self):
        self.set_consistent_capture()
        self.run = True
        process = threading.Thread(name="md_process", target = self._motion_detection)
        process.start()

    def stop(self):
        self.run = False

    @property
    def raw_image_list(self):
        return self.raw_images.imlist

    @property
    def proc_image_list(self):
        return self.proc_images.imlist

    @property
    def thrsh_image_list(self):
        return self.thrsh_image.imlist

    @property
    def bgn_image_list(self):
        print("Num bgn images {}".format(len(self.bgn_image.imlist)))
        return self.bgn_image.imlist

    def archive_raw_images(self):
        return self.raw_images.archive()

    def archive_proc_images(self):
        return self.proc_images.archive()

    def _motion_detection(self):
        '''
        Main algorithm. Calculates difference between raw images and background image.
        Based on instance variable quality_threshold it will decide if there is motion or not.
        '''
        bgn_image_array_gs = []
        bgn_image_ready = False
        while self.run:
            self.lock.acquire()
            # print("Starting cycle")
            start = datetime.datetime.now()
            self.raw_images.add(self.camera.capture()) # add image to the raw collection
            if bgn_image_ready:
                raw_image_array_gs = cv2.imread(self.raw_images[-1], cv2.CV_8U) 
                difference_frame = cv2.absdiff(raw_image_array_gs, bgn_image_array_gs) # get difference between new raw image and bgn image
                processed_image, quality = self._detect_contours(difference_frame, raw_image_array_gs.copy())
                if quality < self.quality_threshold: 
                    name = start.strftime("%Y%m%d%H%M%S")
                    img_path = self.proc_images.add(name)
                    print("Saving processed image to {}".format(img_path))
                    self._write_img(img_path, processed_image) # add() function returns full path to the file
            # print("Length of raw images: {}".format(self.raw_images.count))
            if self.raw_images.full:
                # Wait until raw image collection is full to calculate background image
                bgn_image_array_gs = self._recalculate_bg()
                bgn_image_ready = True
            # measure how much time algorithm took and wait for remainder if it took less then seconds per loop
            time_delta = (datetime.datetime.now() - start).total_seconds()
            self.algorithm_execution_time.append(time_delta)
            time.sleep(max(self.seconds_per_loop - time_delta, 0))
            self.lock.release()

    def _detect_contours(self, difference_image, raw_image=numpy.array([])):
        '''
        Manipulate difference image into binary image and pick out contours that highlight changes.
        If thresholding detected high contrast on the difference image, few contours ( < 20 for 640x480 image) will highlight these regions .
        If thresholding was weak (not much contrast) there will be many contours (> 3000 for min raw images of 5) highlighting slightest of changes.
        TODO: To save computation time, constants returned from thresholding can measure contrast and decide if its worth contouring image any further. 
        '''
        difference_image = cv2.GaussianBlur(difference_image,self.gaussian_filter_area,0)
        constants, threshold = cv2.threshold(difference_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
        img_path = self.thrsh_image.add('th_image')
        # print("Saving thressolded image to {}".format(img_path))
        self._write_img(img_path, threshold)
        contours = cv2.findContours(threshold.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[1]
        quality = len(contours)
        if raw_image.shape[0]:
            for c in contours:
                if cv2.contourArea(c) < self.min_contour_area:
                    continue
                (x,y,w,h) = cv2.boundingRect(c)
                cv2.rectangle(raw_image, (x,y),(x+w,y+h), (255,0,0),2)
        return raw_image, quality

    def _recalculate_bg(self, name='bg_image'):
        result = numpy.array([])
        for i in range(0, self.raw_images.count):
            # print("BGN calc got image: {}".format(self.raw_images[i]))
            img = cv2.imread(self.raw_images[i], cv2.CV_8U) 
            # import pdb;pdb.set_trace()
            if not result.shape[0]:
                result = cv2.divide(img, self.raw_images.count)
            else:
                result = cv2.add(result, cv2.divide(img, self.raw_images.count))
        img_path = self.bgn_image.add(name)
        self._write_img(img_path, result)
        return result

    def _write_img(self, img_path, img):
        cv2.imwrite(img_path +'.png', img) # open cv needs an extension to compress image
        os.rename(img_path + '.png', img_path) # delete extension since app does not support them.