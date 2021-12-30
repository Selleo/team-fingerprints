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


create production.env file in project root directory

PORT=3000
MONGODB_URI=mongodb://localhost:27017/surveys
AUTH0_DOMAIN=your.auth0.domain
AUTH0_AUDIENCE=http://localhost:3000/auth0
API_KEY=safdaifEUJIFGIWYUEFCCVWBevcfvq   -  your key

disable authentication check in api-key.guard.ts file
atach @Public() to route path which should be public

testing credentials 
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM0ZVVpMFVfdVlnYlpjbV9fSXBDYSJ9.eyJpc3MiOiJodHRwczovL2Rldi1sbGt0ZTQxbS51cy5hdXRoMC5jb20vIiwic3ViIjoiS0t4dkwyUnFaVHhZblM1Z1A0eDAxRm02QVB0Yk5DTzdAY2xpZW50cyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hdXRoMCIsImlhdCI6MTY0MDg3NDA2NSwiZXhwIjoxNjQwOTYwNDY1LCJhenAiOiJLS3h2TDJScVpUeFluUzVnUDR4MDFGbTZBUHRiTkNPNyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.p6QYJQyuPleJmnWoRwokIRUK0YMxNEiUY0sV_LBzCSfsJyE96IBAu_bdCDu0EfQcUWS7JPPzk_CJQ_-D7bZSBXUkqS_ILH4LDk4vO8O4VeRrxozP-e6HBrluNmMPkEk1nwiVf7eUcSA73wSEWa7rfJglKldt_RE_X_dKRn5gPw1iWICnyLcARaPVDOZVOgRR9J9Z7uutnNCOcRAFXSq9dbnpgNDl-TWX1R2yUQO588qizqmn4MOq7eT8pVefQqAQ4RgofJi3iXa7t1QxF-MzkItLK81Dk9DVQkA0ib0uIA9FfEQVVJ1rH6dDtvsKsVfnHdmnAHLZGKkMLqWUVbRDqA",
  "token_type": "Bearer"
}

## License

Nest is [MIT licensed](LICENSE).
