# Dojo server

Dojo backend server is built with express.js and typescript.

The backend root path is `/api`

## Service dependencies
The backend is using the following external dependencies:
* MongoDB database
* S3 compatible storage server
* Google OAuth credentials for authentication

## Prerequisites 
1. Node.JS version 22 or later
2. [Docker](https://www.docker.com/get-started/)

## 🛠️ First time setup for local development

In the server root directory:
1. Copy `.env.example` to `.env`
3. `cd dev-services`
4. Run `docker compose up` to setup and run all local service dependencies (Local DB server and local storage server)
5. In a new terminal window, run `npm run setup` from the `server` root directory.
6. run `npm run dev` from the `server` root directory. This command uses `nodemon` to re-run the server after every change of the source files.
7. Test the server by navigating to http://localhost:7777/api-docs in your browser.
8. run `npm run dbsetup` to setup the database with dummy data to work with.

## 📡  Setup for production
1. Run `npm run setup`
2. Make sure to setup all the environment variables either in .env file or in your cloud provider
3. Run `npm build`
4. Run `npm start`

Alternatively, you can use the Dockerfile in the root folder of the repository to deploy both front-end and back-end in a single container.

## 📝 API docs
To view the API docs, visit `http://server-url/api-docs`.

## ⚙️ Environment variables
### Basic
| Name          | Description                                      | Default |
|---------------|--------------------------------------------------|----------
| `PORT`        | The port number on which the server will listen. | 7777
| `DB_URL`      | MongoDB Database connection URL. The server will connect and use this database. | mongodb://localhost:27017/dojo
| `ALLOW_CORS`  | Allow CORS for all backend endpoints. | false
| `BASE_URL` | Server base URL | http://localhost:7777

### Authentication
All variables must be sent in order to make authentication work correctly. We use Sign in with google to login. 

| Name          | Description                                      | Default |
|---------------|--------------------------------------------------|----------
| `JWT_SECRET`  | Signing secret for JWT. This is required for authentication to work correctly | - empty -
| `JWT_EXPIRATION_DAYS` | Number of days for JWT to be valid | 7
| `GOOGLE_OAUTH_CLIENTID` | Google client ID - Must be set for authentication to work. Check [Google authentication Setup](#google-authentication-setup) to learn how to generate this value. | - empty -
| `GOOGLE_OAUTH_CLIENTSECRET` | Google client secret - Must be set for authentication to work .Check [Google authentication Setup](#google-authentication-setup) to learn how to generate this value  | - empty -


### S3 storage config
| Name          | Description                                      | Default |
|---------------|--------------------------------------------------|----------
| `STORAGE_ENDPOINT`  | S3 server endpoint URL. Check your S3 provider to get this value. | http://localhost:9000
| `STORAGE_REGION` | S3 server region. Check your S3 provider to get this value. | ams3
| `STORAGE_BUCKET` | The name of the S3 bucket to use for the storage of all objects | dojo-dev
| `STORAGE_ACCESS_KEY_ID` | The access key of the S3 server. This is created in the S3 provider. | dojo_key
| `STORAGE_ACCESS_KEY_SECRET` | The access key secret of the S3 server. This is created in the S3 provider. | dojo_secret
| `STORAGE_BASE_URL` | The URL to be used to link files to the S3 bucket. This will be used on the client side to fetch images and other documents. Make sure this URL is publicly accessible without authentication. | http://localhost:9000/dojo-dev/
| `STORAGE_BASE_FORCE_PATH_STYLE` | Set to 'true' only when running a local instance of S3 provider. | false

### Sentry config
The following variables are used to send Sentry the source maps. It is not required to set those values for development.

| Name          | Description                                      | Default |
|---------------|--------------------------------------------------|----------
| `SENTRY_AUTH_TOKEN`  | Sentry auth token. Generated in the Sentry portal. | - empty -
| `SENTRY_ENVIRONMENT` | development,  testing, production  | development

### Slack config
Variables used for sending Slack notifications. All are required. Create or update Slack app here: https://api.slack.com/apps

| Name          | Description                                      | Default |
|---------------|--------------------------------------------------|----------
| `SLACK_TOKEN`  | Slack token for sending messages. Can be found in the 'OAuth & Permissions' section. | - empty -
| `SLACK_SIGNING_SECRET` | App signing secret. Can be found in the basic information section. | - empty -
| `SLACK_NOTIFICATION_CHANNEL` | The channel ID to send the notification to. The app must be added to that channel. | - empty -


## Google authentication setup
Dojo uses Sign in with Google. In order to make it work, a new OAuth app needs to be create in  Google API Console. Here are the steps to do so:

1. Sign in to [Google API Console](https://console.developers.google.com/)
2. Navigate to OAuth concent screen -> Get started
3. Finish the setup
4. Create a new OAuth client
4. Choose Web Application type and provide a name
5. Add http://localhost:5173 to Authorised JavaScript origins and Authorised redirect URIs
6. Save and copy the client ID and the client secret to the .env file
