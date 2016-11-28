Cycligent Cloud Worker Demo
===========================

This is a Node.js application used to demonstrate some of the features of 
[Cycligent Cloud](https://www.cycligent.com).

You [can read more about Cycligent Cloud by clicking here](https://www.cycligent.com). You can
[sign-up for a 30-day FREE trial of Cycligent Cloud by clicking here](https://www.cycligent.com/sign-up).

This app calculates digits of Pi, and returns information about the server, such as the time, name of the
worker handling the request, etc.

The layout of the code is as follows:

```
node_modules/          Contains all the external Node.js libraries used for this example.
                       Mainly expressjs, mongodb, and decimal.js and their dependencies.

static/                Contains all the client-side files.
  index.html           The main page of the app.
  jquery-3.1.1.js      The main page uses jquery, so we load this version of it.
  logo.png             The Cycligent Logo
  
server.js              The entry-point of our backend, this wires up expressjs with all the requests
                       we will handle.

calculate-pi.js        The logic for calculating Pi.
pi-ten-thousand.json   Pre-computed values of Pi for checking our results (mainly just for debugging.)
handled-by.js          The logic for determining the name of the worker we're running as, and
                       other information like the name of the worker's version and it's version number.
server-time.js         Super simple code for getting the current time on the server.
version-types.js       Code for determining which version types are available,
                       so we can present them to the user.

.gitignore             The files we tell Git to ignore.
web.config             Config file for IIS.
README.md              This document.
```
