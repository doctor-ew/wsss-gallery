import os
import glob
import PIL
import sys

#print "\n".join(sys.argv[1]);
if len(sys.argv)<2:
	print "null arg"
else:
	#print len(sys.argv);#sys.argv[1];
	print "imgs/"+sys.argv[1];
