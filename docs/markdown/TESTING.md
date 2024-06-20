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

| Test Case ID |                Test Case Description                 |                                           Input Data                                            |                                               Expected Output                                               |                                          Actual Output                                          |
| :----------: | :--------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
|     TC01     |              Redirection without login               |                           Going to Home page (User is not logged in)                            |                                          Redirection to Login Page                                          | [<img src="../assets/TC01.png" style="max-width: 100%; max-height: 400px">](../assets/TC01.png) |
|     TC02     |           Login with an unauthorized user            |                   Click Login with Google button and enter unauthorized email                   |                           Failure login with Error message and stay in Login page                           | [<img src="../assets/TC02.png" style="max-width: 100%; max-height: 400px">](../assets/TC02.png) |
|     TC03     |            Login with an authorized user             |                  Click Login with Google button and enter an authorized email                   |                                  Success login and redirect to Search page                                  | [<img src="../assets/TC03.png" style="max-width: 100%; max-height: 400px">](../assets/TC03.png) |
|     TC04     |                 Logout functionality                 |                     Open user menu from top-right and click Log out button                      |                             Successfully logged out and redirect to Login page                              | [<img src="../assets/TC04.png" style="max-width: 100%; max-height: 400px">](../assets/TC04.png) |
|     TC05     |            Searching for a user (random)             |                          Type a name in search box (ex: Maher alarabi)                          |                                           No results found! alert                                           | [<img src="../assets/TC05.png" style="max-width: 100%; max-height: 400px">](../assets/TC05.png) |
|     TC06     |                 Searching for a user                 |                              Type a name in search box (ex: jalal)                              |                                         A list with founded results                                         | [<img src="../assets/TC06.png" style="max-width: 100%; max-height: 400px">](../assets/TC06.png) |
|     TC07     |                   Trainee profile                    |                   click on a name in the search result list (ex: jalal Rahim)                   |                                     Redirection to Trainee profile page                                     | [<img src="../assets/TC07.png" style="max-width: 100%; max-height: 400px">](../assets/TC07.png) |
|     TC08     |           Trainee profile Sidebar buttons            |                                  click on Slack / Github icon                                   |                                Redirection to Trainee Slack / Github profile                                | [<img src="../assets/TC08.png" style="max-width: 100%; max-height: 400px">](../assets/TC08.png) |
|     TC09     |      Trainee Personal tab - Edit functionality       |                                   Click 'Edit profile' button                                   |     Change all inputs from `readonly` to `outlined` (Edited) inputs and show 'Save' & 'Cancel' buttons      | [<img src="../assets/TC09.png" style="max-width: 100%; max-height: 400px">](../assets/TC09.png) |
|     TC10     |     Trainee Personal tab - Cancel functionality      |                        Edit some trainee info and click 'Cancel' button                         | Inputs will be back to `readonly` view and the edited fields will be back to origin state (before editing)  | [<img src="../assets/TC10.png" style="max-width: 100%; max-height: 400px">](../assets/TC10.png) |
|     TC11     | Trainee Personal tab - Edit functionality with error | Click 'Edit profile' button, edit some trainee info and click 'Save' button (Network has error) |                   Show 'Error saving trainee data' error message and stay in `Edit` mode                    | [<img src="../assets/TC11.png" style="max-width: 100%; max-height: 400px">](../assets/TC11.png) |
|     TC12     |      Trainee Personal tab - Save functionality       |                      Edit some trainee info again and click 'Save' button                       | Show 'Trainee data saved successfully' message and turn to `readonly` mode (PS: Only sending edited fields) | [<img src="../assets/TC12.png" style="max-width: 100%; max-height: 400px">](../assets/TC12.png) |

## Test Results

| Test Case ID |           Tester Name            | Test Status (Pass/Fail) |                                        Comments                                        |
| :----------: | :------------------------------: | :---------------------: | :------------------------------------------------------------------------------------: |
|     TC01     | Stas Seldin [Education Director] |          Pass           |                                          None                                          |
|     TC02     | Stas Seldin [Education Director] |          Pass           |              Email should be added to authorized emails list by director               |
|     TC03     | Stas Seldin [Education Director] |          Pass           |              Email should be added to authorized emails list by director               |
|     TC04     | Stas Seldin [Education Director] |          Pass           |                                          None                                          |
|     TC05     | Stas Seldin [Education Director] |          Pass           |                         Student should be registered in the DB                         |
|     TC06     | Stas Seldin [Education Director] |          Pass           |                         Student should be registered in the DB                         |
|     TC07     | Stas Seldin [Education Director] |          Pass           |                                          None                                          |
|     TC08     | Stas Seldin [Education Director] |          Pass           |                                          None                                          |
|     TC09     | Stas Seldin [Education Director] |          Pass           |                                          None                                          |
|     TC10     | Stas Seldin [Education Director] |          Pass           | Cancel editing fields will clear all edited fields and set values to the initial state |
|     TC11     | Stas Seldin [Education Director] |          Pass           |  If any error happened during `Edit`, `Cancel`, `Save` an Error message will be shown  |
|     TC12     | Stas Seldin [Education Director] |          Pass           |                                          None                                          |

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
  </br>
