import os
import glob
import PIL
import sys
from PIL import Image

basewidth = 100

if len(sys.argv)<2:
	#print "null arg"
	path = "imgs/*"
else:
	path = "imgs/"+sys.argv[1]



# #for i in os.listdir(os.getcwd()):
#for i in os.listdir(path):
#     if i.endswith(".png") or i.endswith(".jpg"): 
#         print i
# 		# img = Image.open(i)
# 		# wpercent = (basewidth/float(img.size[0]))
# 		# hsize = int((float(img.size[1])*float(wpercent)))
# 		# img = img.resize((basewidth,hsize), PIL.Image.ANTIALIAS)
# 		# img.save('tn/' + i)
#         continue
#     else:
#         continue


for fname in glob.glob(path):
 	img = Image.open(fname)
# 	if img.endswith(".png") or img.endswith(".jpg"): 
# 	    ##print(fname)
# 		#img = Image.open(i)
	wpercent = (basewidth/float(img.size[0]))
	hsize = int((float(img.size[1])*float(wpercent)))
	img = img.resize((basewidth,hsize), PIL.Image.ANTIALIAS)
	img.save('tn/' + fname)
# 		continue
# 	else:
# 		continue

