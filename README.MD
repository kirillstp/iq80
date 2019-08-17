
Requirements:
- Raspberry pi with picamera module
- Python 3.5 with virtual environment tools

TO DEPLOY THE APPLICATION:
- Create the virtual environment with python >=3.5.
- 
- Copy project excluding webapp folder
- Copy webapp/dist and webapp/public folders 
- Make sure that app.py is pointing to the correct index.html 
- Run configure.sh - install pip requirments
- Verify that uwsgi was correctly installed by running uswgi command - check binary address which should point ot /your/virtual/environment/bin/uwsgi
- Copy iq80.service to /etc/systemd/system/ to run application on start up
- Copy iq80.ini to the project directory: to start uwsgi server run uwsgi --ini iq80.ini - NOTE: at this point its serving binary gibberish. Configure nginx to continue

- 

