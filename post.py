import json,sys, os, glob, PIL, sys
from PIL import Image


def upload_img(req):
	imgs = req.form	



def get_info(req): 

	info = req.form	

	a = info['data']

	out_file = open("/var/www/html/adultswim/wsss/gallery/order.json","w")

	data = json.loads(a)
	json.dump(data,out_file, indent=4)                                    

	out_file.close()

	return """
<html><head>
<title>POST method with mod_python</title>
</head>
<body>
<h1>POST method with mod_python</h1>
<hr><br>
Your data is: %s <br>
</body>
</html>
""" %(data)
