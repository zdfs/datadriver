# Datadriver

Datadriver is a helper library, written on top of the [WebdriverIO](http://webdriver.io) API that allows you to use
JavaScript data structures for driving your tests.

## Unit Tests

You can run the unit tests by navigating to the root directory and executing this command:
`./node_modules/.bin/tape tests/unit/*.js | ./node_modules/.bin/tap-spec`

## Integration Tests

You can run the integration tests by going to the root directory and executing this command:
`grunt webdriver --url=http://datadriver.io`