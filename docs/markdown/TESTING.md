# DOJO Testing Document

## Test Plans

### Unit testing

Unit tests will be slowly implemented after the first release of the application and within the time constraints.

The implementation will be in stages:

1. Unit tests for the most critical flows of the application.
2. Unit tests for the most common flows.
3. All other low priority unit tests.

We will use the popular [Jest] (https://jestjs.io/) library to implement unit tests.

### Integration testing

In the future, automated tests can be implemented with [cypress].
The tests will run on a fixed cadence and report any issues.

Having automated tests has potential to greatly improve the quality of the application.

### System testing

Tests will be added later to the complete integrated system to ensure it meets the specified requirements.

Testing will be for the entire system's functionality, performance, security, and usability.

Tools can be used: [Selenium], [JMeter] (for performance testing), [OWASP-ZAP] (for security testing), etc.

### User Acceptance testing (UAT)

UAT testing was done per PR by Project team and Education Director to validate the system meets the needs and requirements.

## Test Cases

| Test Case ID |      Test Case Description      |                          Input Data                          |                     Expected Output                     |                                          Actual Output                                          |
| :----------: | :-----------------------------: | :----------------------------------------------------------: | :-----------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
|     TC01     |    Redirection without login    |          Going to Home page (User is not logged in)          |                Redirection to Login Page                | [<img src="../assets/TC01.png" style="max-width: 100%; max-height: 400px">](../assets/TC01.png) |
|     TC02     | Login with an unauthorized user | Click Login with Google button and enter unauthorized email  | Failure login with Error message and stay in Login page | [<img src="../assets/TC02.png" style="max-width: 100%; max-height: 400px">](../assets/TC02.png) |
|     TC03     |  Login with an authorized user  | Click Login with Google button and enter an authorized email |        Success login and redirect to Search page        | [<img src="../assets/TC03.png" style="max-width: 100%; max-height: 400px">](../assets/TC03.png) |

## Test Results

| Test Case ID |           Tester Name            | Test Status (Pass/Fail) |                    Defects/Issues Found                     |
| :----------: | :------------------------------: | :---------------------: | :---------------------------------------------------------: |
|     TC01     | Stas Seldin [Education Director] |          Pass           |                            None                             |
|     TC02     | Stas Seldin [Education Director] |          Pass           | Email should be added to authorized emails list by director |
|     TC03     | Stas Seldin [Education Director] |          Pass           | Email should be added to authorized emails list by director |

## Risk Assessment

### Potential Risks

- Data Loss: Risk of losing student data during migration or system failure.
- Security Vulnerabilities: Risk of unauthorized access to sensitive data.
- System Failures: Risk of system downtime or crashes.
- Compliance Issues: Risk of not complying with data protection regulations.

### Risk Mitigation Plans

- Regular Backups: Schedule regular database backups and test recovery procedures.
- Security Audits: Conduct periodic security audits and penetration testing.
- Load Testing: Perform load and stress testing to ensure system stability under heavy load.
- Compliance Checks: Regularly review and update the system to comply with data protection regulations.
