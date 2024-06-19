# DOJO Testing Document

## Test Plans

### Unit testing

- Unit tests will be slowly implemented after the first release of the application and within the time constraints.

The implementation will be in stages:

1. Unit tests for the most critical flows of the application.
2. Unit tests for the most common flows.
3. All other low priority unit tests.

We will use the popular [Jest] (https://jestjs.io/) library to implement unit tests.

### Integration testing

- In the future, automated tests can be implemented with cypress.
  The tests will run on a fixed cadence and report any issues.

Having automated tests has potential to greatly improve the quality of the application.

### System testing

- Tests will be added later to the complete integrated system to ensure it meets the specified requirements.

Testing will be for the entire system's functionality, performance, security, and usability.
Tools can be used: Selenium, JMeter (for performance testing), OWASP ZAP (for security testing), etc.

### User Acceptance testing (UAT)

- UAT testing was done per PR by Project team and Education Director to validate the system meets the needs and requirements.

## Test Cases

## Test Results

## Risk Assessment
