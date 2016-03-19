def index():	

	return """
<html><head>
<title>get_time function</title>
</head>
<body>
<FORM value="form" action="hello.py/get_info" method="post">
  <P>
	<LABEL for="firstname">First name: </LABEL>
	<INPUT type="text" name="firstname"><BR>
	<LABEL for="lastname">Last name: </LABEL>
	<INPUT type="text" name="lastname"><BR>
	<LABEL for="email">email: </LABEL>
	<INPUT type="text" name="email"><BR>
	<INPUT type="radio" name="gender" value="Male"> Male<BR>
	<INPUT type="radio" name="gender" value="Female"> Female<BR>
	<INPUT type="submit" value="Send"> <INPUT type="reset">
  </P>
</FORM>
</body>
</html>
"""


def get_info(req): 

	info = req.form	

	a = info['firstname']
	b = info['lastname']
	c = info['email']
	d = info['gender']

	return """
<html><head>
<title>POST method with mod_python</title>
</head>
<body>
<h1>POST method with mod_python</h1>
<hr><br>
Your firstname is: %s <br>
Your lastname is: %s <br>
Your email is: %s <br>
You are a %s <br>
</body>
</html>
""" %(a,b.upper(),c,d.lower())

