## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## app config setup 
create development.env file in project root directory

PORT=3000
MONGODB_URI=mongodb://localhost:27017/surveys
AUTH0_DOMAIN=your.auth0.domain
AUTH0_AUDIENCE=http://localhost:3000/auth0
API_KEY=safdaifEUJIFGIWYUEFCCVWBevcfvq   -  your key


## License

Nest is [MIT licensed](LICENSE).
