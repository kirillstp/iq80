
Smart home framework for RPi camera, ESP8266 and Arduino (with WiFi shield) driven sensors. Currently only motion detection camera has been implemented. 

Project can be deployed on the web (although security is lacking at the moment) or locally. Project is built using Python's Flask and React. Deployment is on uWSGI/NGINX server.


Requirements:
- Raspberry pi with picamera module
- Python 3.5 with virtual environment tools

To deploy:
- Create the virtual environment with python >=3.5.
- Copy project excluding webapp folder
- Copy webapp/dist and webapp/public folders 
- Make sure that app.py is pointing to the correct index.html 
- Run configure.sh - install pip requirments
- Verify that uwsgi was correctly installed by running "uswgi"
- Copy iq80.service to /etc/systemd/system/ to run application on start up
- Copy iq80.ini to the project directory: to start uwsgi server run uwsgi --ini iq80.ini
- Configure nginx to work with uwsgi server. 


