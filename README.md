# Link shortener web application

This web application is available on [https://crypto-conversion-calculator.herokuapp.com/](https://crypto-conversion-calculator.herokuapp.com/)

## Technology used

This app is built with Rails 6.0.3.2. The databse is Postgresql. The templating language chosen is ERB and Bootstrap is used as the CSS framework. This appliation uses javacript to copy the short url generated to the clipboard.

## Getting started

To get started with the app, clone the repo and then install the needed gems:
```
$ bundle install --without production
```
Next, migrate the database:
```
$ rails db:migrate
```
Finally, run the test suite to verify that everything is working correctly:
```
$ rails test
```
If the test suite passes, you'll be ready to run the app in a local server:
```
$ rails server
```
To deploy this app on Heroku, create a Heroku app
```
$ heroku create
```
Next, run the command
```
$ git push heroku
```
And last, migrate the database for production:
```
$ heroku run rails db:migrate
```
