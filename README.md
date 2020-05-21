### Instructions:
1. Clone our repo to your machine: 
```git clone git@github.com:cutpaste-team/Web-app.git```

2. Create virtual environment
```cd Web-app```
```virtualenv venv```
```source venv/bin/activate```

3. Client side: Install node modules and start npm:
```npm install```
```npm start```

4. Server side:
```cd api/```

Install torch and torchvision separately
```pip install torch torchvision no-cache-dir```

Install the rest of the package:
```pip install -r requirements.txt```

Start the server
```FLASK_DEBUG=1 FLASK_APP=app.py flask run```
