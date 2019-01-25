# MongoDB with Mongoose on Node.js for Stripe PaymentContext backend 

Provides a simple Backend for being used with Stripe PaymentContext : you can generate the basic EphemeralKey but also keep track of your customer ID and theirs saved credit cards. More in https://stripe.com/docs/mobile/ios/standard . 

MongoDB and Node.js are often used together because of their shared use of Javascript and its Object Notation (JSON).  Mongoose is a popular helper library that provides a more rigorous modeling environment for your data, enforcing a little bit more structure as needed, while still maintaining flexibility that makes MongoDB powerful.  

## Deployment

### Locally
0. You need MongoDB running locally on port 27017: https://docs.mongodb.com/manual/administration/install-community/
1. `git clone git@github.com:maatthc/stripe-paymentcontext-backend.git && cd strip-payment-backend`
2. cp config.default.js config.js
3. Add your our Stripe keys to the config.js
3. npm install
4. npm start

### Heroku

To deploy to Heroku you can use the Heroku button [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy) or follow these steps:

1. `git clone git@github.com:maatthc/stripe-paymentcontext-backend.git && cd strip-payment-backend`
2. `heroku create`
3. `heroku addons:add mongolab`
3. `git push heroku master`
4. `heroku open`

### Docker

The app can be debugged and tested using the [Heroku Docker CLI plugin](https://devcenter.heroku.com/articles/introduction-local-development-with-docker).

Make sure the plugin is installed:

    heroku plugins:install heroku-docker

Configure Docker and Docker Compose:

    heroku docker:init

And run the app locally:

    docker-compose up

The app will now be available on the Docker daemon IP on port 8080.

You can also use Docker to release to Heroku:

    heroku create
    heroku docker:release
    heroku open

### AWS
TODO CloudFormation (ECS/Fargate)
## License

MIT Licensed
