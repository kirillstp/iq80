
import os
import time
import numpy
import cv2
import threading


raw_images = []
background_image = None
raw_image_dir = 'test_images\\'
prc_image_dir = 'test_images_processed\\'
raw_images = [raw_image_dir+img_name for img_name in os.listdir(raw_image_dir)]
min_num_raw_images  = 3
background_image_lag = 5
quality_threshold = 50 # in contours. More contours less noisy and reliable image is (thresholding was picking out small details)


img_iter = 0
background_images = []

def recalculate_bg(background_images):
    result = numpy.array([])
    for i in background_images:
        # import pdb;pdb.set_trace()
        if not result.shape[0]:
            result = cv2.divide(i, len(background_images))
        else:
            result = cv2.add(result, cv2.divide(i, len(background_images)))
    return result

def detect_contours(difference_image, raw_image=numpy.array([])):
    difference_image = cv2.GaussianBlur(difference_image,(5,5),0)
    constants, threshold = cv2.threshold(difference_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    cv2.imshow("thresholded", threshold)
    contours = cv2.findContours(threshold.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]
    quality = len(contours)
    if raw_image.shape[0]:
        for c in contours:
            if cv2.contourArea(c) < 500:
                continue
            (x,y,w,h) = cv2.boundingRect(c)
            cv2.rectangle(raw_image, (x,y),(x+w,y+h), (255,0,0),2)
    return raw_image, quality

motion_detected = False
for i in raw_images:
    raw_image_gs = cv2.imread(i,cv2.CV_8U)   
    if img_iter < min_num_raw_images:
        background_images.append(raw_image_gs)
    else:
        cv2.imshow("background_image", background_image)
        difference_frame = cv2.absdiff(raw_image_gs, background_image)
        processed_image, quality = detect_contours(difference_frame, raw_image_gs.copy())
        if quality < quality_threshold: 
            cv2.imwrite(prc_image_dir+i.split('\\')[-1],processed_image)
            cv2.imshow("processed_image", processed_image)
            # raw_image_gs = cv2.divide(raw_image_gs, 2) # divide by 2 to reduce weight for the backg
        cv2.imshow("difference", difference_frame)
        background_images.append(raw_image_gs)
        cv2.waitKey(100)
    print('Calculating background image {}'.format(img_iter))
    background_images = background_images[-min_num_raw_images:]
    background_image = recalculate_bg(background_images)
    img_iter += 1





    
