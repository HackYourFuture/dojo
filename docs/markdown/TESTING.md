# DOJO Testing Document

## Test Plans

### Unit testing

Unit tests will be slowly implemented after the first release of the application and within the time constraints.

The implementation will be in stages:

1. Unit tests for the most critical flows of the application.
2. Unit tests for the most common flows.
3. All other low priority unit tests.

We will use the popular [Jest](https://jestjs.io/) library to implement unit tests.

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

| Test Case ID |                    Test Case Description                    |                                                  Input Data                                                   |                                               Expected Output                                               |                                          Actual Output                                          |
| :----------: | :---------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
|     TC01     |                  Redirection without login                  |                                  Going to Home page (User is not logged in)                                   |                                          Redirection to Login Page                                          | [<img src="../assets/TC01.png" style="max-width: 100%; max-height: 400px">](../assets/TC01.png) |
|     TC02     |               Login with an unauthorized user               |                          Click Login with Google button and enter unauthorized email                          |                           Failure login with Error message and stay in Login page                           | [<img src="../assets/TC02.png" style="max-width: 100%; max-height: 400px">](../assets/TC02.png) |
|     TC03     |                Login with an authorized user                |                         Click Login with Google button and enter an authorized email                          |                                  Success login and redirect to Search page                                  | [<img src="../assets/TC03.png" style="max-width: 100%; max-height: 400px">](../assets/TC03.png) |
|     TC04     |                    Logout functionality                     |                            Open user menu from top-right and click Log out button                             |                             Successfully logged out and redirect to Login page                              | [<img src="../assets/TC04.png" style="max-width: 100%; max-height: 400px">](../assets/TC04.png) |
|     TC05     |                Searching for a user (random)                |                                 Type a name in search box (ex: Maher alarabi)                                 |                                  No results found! (in search result list)                                  | [<img src="../assets/TC05.png" style="max-width: 100%; max-height: 400px">](../assets/TC05.png) |
|     TC06     |                    Searching for a user                     |                                     Type a name in search box (ex: jalal)                                     |                                         A list with founded results                                         | [<img src="../assets/TC06.png" style="max-width: 100%; max-height: 400px">](../assets/TC06.png) |
|     TC07     |                       Trainee profile                       |                          click on a name in the search result list (ex: jalal Rahim)                          |                                     Redirection to Trainee profile page                                     | [<img src="../assets/TC07.png" style="max-width: 100%; max-height: 400px">](../assets/TC07.png) |
|     TC08     |               Trainee profile Sidebar buttons               |                                 click on Slack / Github / Linkedin icon icon                                  |                       Redirection to Trainee Slack / Github / Linkedin profile pages                        | [<img src="../assets/TC08.png" style="max-width: 100%; max-height: 400px">](../assets/TC08.png) |
|     TC09     |          Trainee Personal tab - Edit functionality          |                                          Click 'Edit profile' button                                          |     Change all inputs from `readonly` to `outlined` (Edited) inputs and show 'Save' & 'Cancel' buttons      | [<img src="../assets/TC09.png" style="max-width: 100%; max-height: 400px">](../assets/TC09.png) |
|     TC10     |         Trainee Personal tab - Cancel functionality         |                               Edit some trainee info and click 'Cancel' button                                | Inputs will be back to `readonly` view and the edited fields will be back to origin state (before editing)  | [<img src="../assets/TC10.png" style="max-width: 100%; max-height: 400px">](../assets/TC10.png) |
|     TC11     |    Trainee Personal tab - Edit functionality with error     |        Click 'Edit profile' button, edit some trainee info and click 'Save' button (Network has error)        |                   Show 'Error saving trainee data' error message and stay in `Edit` mode                    | [<img src="../assets/TC11.png" style="max-width: 100%; max-height: 400px">](../assets/TC11.png) |
|     TC12     |          Trainee Personal tab - Save functionality          |                             Edit some trainee info again and click 'Save' button                              | Show 'Trainee data saved successfully' message and turn to `readonly` mode (PS: Only sending edited fields) | [<img src="../assets/TC12.png" style="max-width: 100%; max-height: 400px">](../assets/TC12.png) |
|     TC13     |                     Trainee Contact tab                     |                                  Click 'Contact' tab from the profile Navbar                                  |                                     Redirecting to Trainee Contact page                                     | [<img src="../assets/TC13.png" style="max-width: 100%; max-height: 400px">](../assets/TC13.png) |
|     TC14     |                 Trainee Contact tab - Email                 |                                Click `link` icon on the right of 'Email' field                                |                                            Open New Email window                                            | [<img src="../assets/TC14.png" style="max-width: 100%; max-height: 400px">](../assets/TC14.png) |
|     TC15     |                 Trainee Contact tab - Slack                 |                              Click `link` icon on the right of 'Slack ID' field                               |                                            Open New Slack window                                            | [<img src="../assets/TC15.png" style="max-width: 100%; max-height: 400px">](../assets/TC15.png) |
|     TC16     |                Trainee Contact tab - Github                 |                            Click `link` icon on the right of 'Github Handle' field                            |                                Open Trainee Github profile page in a new tab                                | [<img src="../assets/TC16.png" style="max-width: 100%; max-height: 400px">](../assets/TC16.png) |
|     TC17     |               Trainee Contact tab - Linkedin                |                              Click `link` icon on the right of 'Linkedin' field                               |                               Open Trainee Linkedin profile page in a new tab                               | [<img src="../assets/TC17.png" style="max-width: 100%; max-height: 400px">](../assets/TC17.png) |
|     TC18     |                    Trainee Education tab                    |                                 Click 'Education' tab from the profile Navbar                                 |                                    Redirecting to Trainee Education page                                    | [<img src="../assets/TC18.png" style="max-width: 100%; max-height: 400px">](../assets/TC18.png) |
|     TC19     |         Trainee Education tab - Edit functionality          |                                 Click 'Edit profile' button in Education page                                 |     Change all inputs from `readonly` to `outlined` (Edited) inputs and show 'Save' & 'Cancel' buttons      | [<img src="../assets/TC19.png" style="max-width: 100%; max-height: 400px">](../assets/TC19.png) |
|     TC20     | Trainee Education tab - Edit learning status -> 'Graduated' | Click 'Edit profile' button in Education page, change Learning status to 'Graduated' then click 'Save' button |           'Graduation date' input will appear and Learning status will be changed to 'Graduated'            | [<img src="../assets/TC20.png" style="max-width: 100%; max-height: 400px">](../assets/TC20.png) |
|     TC21     |   Trainee Education tab - Edit learning status -> 'Quit'    |   Click 'Edit profile' button in Education page, change Learning status to 'Quit' then click 'Save' button    |       'Quit date' and 'Quit reason' inputs will appear and Learning status will be changed to 'Quit'        | [<img src="../assets/TC21.png" style="max-width: 100%; max-height: 400px">](../assets/TC21.png) |
|     TC22     |      Trainee Education tab - Add strike functionality       |                                  Click 'New strike' button in Education page                                  |                                         Open adding a strike modal                                          | [<img src="../assets/TC22.png" style="max-width: 100%; max-height: 400px">](../assets/TC22.png) |
|     TC23     |       Trainee Education tab - Cancel Adding a strike        |                      Edit some inputs and click 'Cancel' button in adding a strike modal                      |        The edited fields will be back to origin state (before editing) and the modal will be closed         | [<img src="../assets/TC23.png" style="max-width: 100%; max-height: 400px">](../assets/TC23.png) |
|     TC24     |                   Trainee Employment tab                    |                                Click 'Employment' tab from the profile Navbar                                 |                                   Redirecting to Trainee Employment page                                    | [<img src="../assets/TC24.png" style="max-width: 100%; max-height: 400px">](../assets/TC24.png) |
|     TC25     |         Trainee Employment tab - Edit functionality         |                                Click 'Edit profile' button in Employment page                                 |     Change all inputs from `readonly` to `outlined` (Edited) inputs and show 'Save' & 'Cancel' buttons      | [<img src="../assets/TC25.png" style="max-width: 100%; max-height: 400px">](../assets/TC25.png) |
|     TC26     |        Trainee Employment tab - Cancel functionality        |                      Edit some trainee info in Employment page and click 'Cancel' button                      | Inputs will be back to `readonly` view and the edited fields will be back to origin state (before editing)  | [<img src="../assets/TC26.png" style="max-width: 100%; max-height: 400px">](../assets/TC26.png) |
|     TC27     |                 Trainee Employment tab - CV                 |                                 Click `link` icon on the right of 'CV' field                                  |                             Open a page where Trainee CV is stored in a new tab                             | [<img src="../assets/TC27.png" style="max-width: 100%; max-height: 400px">](../assets/TC27.png) |
|     TC28     |                   Main Navbar - Home page                   |                                Click 'Home' button from the main Navbar on top                                |                                         Redirecting to Search page                                          | [<img src="../assets/TC28.png" style="max-width: 100%; max-height: 400px">](../assets/TC28.png) |
|     TC29     |                 Main Navbar - Cohorts page                  |                              Click 'Cohorts' button from the main Navbar on top                               |                                         Redirecting to Cohorts page                                         | [<img src="../assets/TC29.png" style="max-width: 100%; max-height: 400px">](../assets/TC29.png) |
|     TC30     |                Main Navbar - Dashboard page                 |                             Click 'Dashboard' button from the main Navbar on top                              |                                        Redirecting to Dashboard page                                        | [<img src="../assets/TC30.png" style="max-width: 100%; max-height: 400px">](../assets/TC30.png) |
|     TC31     |                  Main Navbar - Search page                  |                             Click 'search' icon from the main Navbar on top-right                             |                                         Redirecting to Search page                                          | [<img src="../assets/TC31.png" style="max-width: 100%; max-height: 400px">](../assets/TC31.png) |
|     TC32     |                   Main Navbar - User menu                   |                              Click 'user' icon from the main Navbar on top-right                              |                      Open a user menu dropdown with 'Login' and 'Log out' button items                      | [<img src="../assets/TC32.png" style="max-width: 100%; max-height: 400px">](../assets/TC32.png) |
|     TC33     |                   User menu - Login Page                    |                    Open user menu from the main Navbar on top-right and click Login button                    |                                          Redirecting to Login page                                          | [<img src="../assets/TC33.png" style="max-width: 100%; max-height: 400px">](../assets/TC33.png) |
|     TC34     |                       Dashboard page                        |                             Click 'Dashboard' button from the main Navbar on top                              |                Redirecting to Dashboard page and shows date range selector with 4 pie charts                | [<img src="../assets/TC34.png" style="max-width: 100%; max-height: 400px">](../assets/TC34.png) |
|     TC35     |              Dashboard page update charts data              |            Change date range by clicking on calendar icon on date inputs then click 'Apply' button            |                                   Updating the charts with relevent data                                    | [<img src="../assets/TC35.png" style="max-width: 100%; max-height: 400px">](../assets/TC35.png) |

## Test Results

| Test Case ID |           Tester Name            | Test Status (Pass/Fail) |                                                   Comments                                                    |
| :----------: | :------------------------------: | :---------------------: | :-----------------------------------------------------------------------------------------------------------: |
|     TC01     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC02     | Stas Seldin [Education Director] |          Pass           |                          Email should be added to authorized emails list by director                          |
|     TC03     | Stas Seldin [Education Director] |          Pass           |                          Email should be added to authorized emails list by director                          |
|     TC04     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC05     | Stas Seldin [Education Director] |          Pass           |                                    Student should be registered in the DB                                     |
|     TC06     | Stas Seldin [Education Director] |          Pass           |                                    Student should be registered in the DB                                     |
|     TC07     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC08     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC09     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC10     | Stas Seldin [Education Director] |          Pass           |            Cancel editing fields will clear all edited fields and set values to the initial state             |
|     TC11     | Stas Seldin [Education Director] |          Pass           |             If any error happened during `Edit`, `Cancel`, `Save` an Error message will be shown              |
|     TC12     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC13     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC14     | Stas Seldin [Education Director] |          Pass           |     If trainee 'Email' field has a value, the `link` icon will be shown otherwise the icon will be hidden     |
|     TC15     | Stas Seldin [Education Director] |          Pass           |   If trainee 'Slack ID' field has a value, the `link` icon will be shown otherwise the icon will be hidden    |
|     TC16     | Stas Seldin [Education Director] |          Pass           | If trainee 'Github Handle' field has a value, the `link` icon will be shown otherwise the icon will be hidden |
|     TC17     | Stas Seldin [Education Director] |          Pass           |   If trainee 'Linkedin' field has a value, the `link` icon will be shown otherwise the icon will be hidden    |
|     TC18     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC19     | Stas Seldin [Education Director] |          Pass           |                      'Cohort' and 'Start cohort' fields accept only numbers, not letters                      |
|     TC20     | Stas Seldin [Education Director] |          Pass           |                  'Graduation date' input will only appear if Learning status is 'Graduated'                   |
|     TC21     | Stas Seldin [Education Director] |          Pass           |              'Quit date' and 'Quit reason' inputs will only appear if Learning status is 'Quit'               |
|     TC22     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC23     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC24     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC25     | Stas Seldin [Education Director] |          Pass           |                                   CV input is a link to where CV is stored                                    |
|     TC26     | Stas Seldin [Education Director] |          Pass           |            Cancel editing fields will clear all edited fields and set values to the initial state             |
|     TC27     | Stas Seldin [Education Director] |          Pass           |      If trainee 'CV' field has a value, the `link` icon will be shown otherwise the icon will be hidden       |
|     TC28     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC29     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC30     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC31     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC32     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC33     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC34     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |
|     TC35     | Stas Seldin [Education Director] |          Pass           |                                                     None                                                      |

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
