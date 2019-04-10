import datetime
import picamera
import logging
import time 
import os
import warnings
import functools 

camera = None

class _Camera(object):
    NAME = "CAMERA CONTROLLER"
    NO_CAMERA_WARNING = "No Camera Initialized. Command had no effect."
    def __init__(self, output_dir = "/home/pi/Projects/iq80/static/raw_images"):
        self.logger  = logging.getLogger("iq80")
        self.logger.info("Initializing server...")
        try:
            self.camera = picamera.PiCamera()
            self.camera.resolution = (640, 480)
            self.camera.rotation = 180
        except picamera.exc.PiCameraMMALError:
            self.camera = None
            self.logger.error("Camera already initialized on a different instance. Cannot run.")
        self.output_dir = output_dir
        if not os.path.isdir(self.output_dir):
            self.logger.info("{}: Creating file output directory {}".format(self.NAME, self.output_dir))
            os.makedirs(self.output_dir)
        else:
            self.logger.info("{}: Saving images to {}".format(self.NAME, self.output_dir))
        self.logger.info("{}: Camera is warming up. Please wait...".format(self.NAME))
        time.sleep(2)

    def set_output_directory(self, path):
        self.output_dir = path

    @property
    def height(self):
        return self.camera.resolution[1]
    
    @property
    def width(self):
        return self.camera.resolution[0]

    @property
    def rotation(self):
        return self.camera.rotation
    
    @property
    def iso(self):
        return self.camera.iso
    
    @iso.setter
    def iso(self, value):
        self.logger.info("{}: Setting iso to {}".format(self.NAME, value))
        self.camera.iso = value
        time.sleep(2)

    @property
    def shutter_speed(self):
        return self.camera.shutter_speed
    
    @property
    def exposure_speed(self):
        return self.camera.exposure_speed

    @shutter_speed.setter
    def shutter_speed(self, value):
        self.camera.shutter_speed = value

    def turn_off_exposure_mode(self):
        self.camera.exposure_mode = 'off'
    
    def turn_on_exposure_mode(self):
        self.camera.exposure_mode = 'auto'

    def turn_off_awb(self, value = None):
        # optional value to set white balance 
        g = value if value else self.camera.awb_gains
        self.camera.awb_mode = 'off'
        self.camera.awb_gains = g

    def turn_on_awb(self,value):
        self.camera.awb_mode = 'auto'

    def set_resolution(self, h = 0, w = 0):
        try:
            h = int(h)
            w = int(w)
        except TypeError as e:
            self.logger.error("{}: Invalid data type while setting resolution. Nothing happened.".format(self.NAME))
            return
        if h and w:
            self.logger.info("{}: Setting resolution to {} by {} pixels".format(self.NAME, w, h))
            # Wait for any capture to finish.
            time.sleep(1)
            self.camera.resolution = (w,h)

    def rotate(self, r = 180):
        try:
            r = int(r)
        except TypeError as e:
            self.logger.error("{}: Invalid data type while setting resolution. Nothing happened.".format(self.NAME))
            return
        if r: 
            self.logger.info("{}: Rotating to {} degrees".format(self.NAME, r))
            # Wait for any capture to finish.
            time.sleep(1)
            self.camera.rotation = r

    def capture(self):
        if not self.camera:
            warnings.warn(self.NO_CAMERA_WARNING)
            return
        filename = os.path.join(self.output_dir, datetime.datetime.now().strftime("%Y%m%d%H%M%S"))
        self.camera.capture(output=filename, format="png")
        return '/'.join(filename.split('/')[-1:])

    def clean_up(self):
        self.camera.close()



def get_camera(new_image_path):
    global camera
    if not camera:
        camera = _Camera()
    camera.set_output_directory(new_image_path)
    return camera


# if __name__ == "__main__":
#     cam = Camera()
#     try:
#         print(cam.capture())
#         time.sleep(1)
#         print(cam.capture())
#         time.sleep(1)
#     except Exception as e: 
#         print(e)
#     finally:
#         cam.camera.close()
        