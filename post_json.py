#!/usr/bin/python

import json,sys

with open('order_0.json', 'w') as outfile:
    json.dump(sys.argv[1], outfile)

