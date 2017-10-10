# PREDIX - CITYIQ / GOOGLE.MAPS POC APP

## About

Built by [maxceem](https://www.topcoder.com/members/maxceem/) on topcoder.com

Challenge Details: https://www.topcoder.com/challenge-details/30059233/?type=develop&noncache=true


## Video

The demo video is available on the YouTube by [this link](https://youtu.be/klmUv54Px0M) only.


## Deployed project

Deployed to Predix Cloud project is available by link https://topcoder-predix-cityiq.run.aws-usw02-pr.ice.predix.io/.


## Prerequisites

- Node v7.5+
- Npm v4.2.1+


## Setup


### Server Config

Server config file is placed at the `/src/server/config/config.js`. It lacks some values which have to be obtained in the steps below.
Don't directly run commands which I mention in the description in this table. I only put them as a reference here, but they have to be run in context with proper arguments. Please follow steps from the [Predix UAA and Asset Services section](#predix-uaa-and-asset-services).

|Value                | Description |
|---------------------|-------------|
|`predix.uaaUrl`      | Predix UAA Service URI.<br/> You get it after performing `px create-service predix-uaa Free your-name-uaa` in [Predix Guide](https://www.predix.io/resources/tutorials/tutorial-details.html?tutorial_id=2396&tag=1719&journey=Hello%20World&resources=1844,2388,2369,2396,1569,1523) section **Create an instance of the User Account and Authentication (UAA) Service** |
|`predix.clientId`    | Id of the client which has access to Predix Asset Service.<br/> You define it as an argument `--client-id app_client_id` when performing command `px cs predix-asset Free your-name-asset your-name-uaa --client-id app_client_id` in [Predix Guide](https://www.predix.io/resources/tutorials/tutorial-details.html?tutorial_id=2396&tag=1719&journey=Hello%20World&resources=1844,2388,2369,2396,1569,1523) section **Create a Predix Service** |
|`predix.clientSecret`|  A secret of the client with id `predix.clientId` from the item above.<br/> You define during performing command above when you are prompted for `Client Secret>`. |
|`predix.apiUrl`      | Predix API endpoint.<br/> You get as an output of the command `px cs predix-asset Free your-name-asset your-name-uaa --client-id app_client_id` in [Predix Guide](https://www.predix.io/resources/tutorials/tutorial-details.html?tutorial_id=2396&tag=1719&journey=Hello%20World&resources=1844,2388,2369,2396,1569,1523) section **Create a Predix Service**  |
|`predix.zoneId`      | Predix Zone Id of the created instance of Predix Asset service.<br/> You get as an output of the command `px cs predix-asset Free your-name-asset your-name-uaa --client-id app_client_id` in [Predix Guide](https://www.predix.io/resources/tutorials/tutorial-details.html?tutorial_id=2396&tag=1719&journey=Hello%20World&resources=1844,2388,2369,2396,1569,1523) section **Create a Predix Service** |
|`google.places.key`  | Google API key, which allows access to **Google Places API Web Service**.<br> To obtain it, please, follow [Google Maps API section](#google-maps-api). |

Manifest file for deploying to Predix Cloud is placed in the root of the project `/manifest.yml`.

|Value                 | Description |
|----------------------|-------------|
|`applications[0].name`| Unique for Predix application name. It will be a part of your application domain like `https://${applications[0].name}.run.aws-usw02-pr.ice.predix.io`. You can just define any, which you want as long as it's unique. |


### Client Config

Client config is placed at the `/src/clinet/config/config.js`. It's separated from the server config, so that server config values are not included in scripts bundle which can be accessed by anyone.
Only one value has to be configured there.

|Value                | Description |
|---------------------|-------------|
|`GOOGLE_MAPS_KEY`    | Google API key, which allows access to **Google Maps JavaScript API**.<br> To obtain it, please, follow [Google Maps API section](#google-maps-api). |


### Predix UAA and Asset Services

I suppose that you already have a Predix account. Otherwise, you can [register](https://www.predix.io/registration/). Be aware that if you are not white-listed during some Topcoder challenge, your application can be rejected. See [Predix Topcoder Community](http://predix.topcoder.com/) for more information.

Please, complete sections **What you need to set up** and **What you need to do** from [Predix Guide](https://www.predix.io/resources/tutorials/tutorial-details.html?tutorial_id=2396&tag=1719&journey=Hello%20World&resources=1844,2388,2369,2396,1569,1523).
In the description below I will only tell which configuration values you will get on each step.

- **What you need to set up**

  - Make sure you've installed all required tools.

  - **It's important to have the latest version 0.6.3 or later of Predix CLI**. You can check a version number by running `px -v` in your console. To update, just install a newer version following [Predix CLI readme](https://github.com/PredixDev/predix-cli).

  - In case of error
    ```
    FAILED
    Error read/writing config:  open /Users/%user%/.cf/config.json: permission denied
    ```
    Remove the `~/.cf` dir first `sudo rm -r ~/.cf` and after run some `px`/`cf` command, for example `px -h`.

- **What you need to do**
  - **Sign in to Predix**

  - **Create an instance of the User Account and Authentication (UAA) Service**

    On this step, you will obtain `uri` for `predix.uaaUrl` value in config, which looks like `https://123a4567-89a0-1abc-123a-1ab2c3d456e7.predix-uaa.run.aws-usw02-pr.ice.predix.io`

  - **Create a Predix Service**

    You will obtain:
    - `predix.apiUrl` you will get ti is an output in `uri` property. It looks like `https://predix-asset.run.aws-usw02-pr.ice.predix.io`.
    - `predix.clientId` is the value you've entered instead of `app_client_id` in the command `px cs predix-asset Free your-name-asset your-name-uaa --client-id app_client_id`
    - `predix.clientSecret` is the secret word which you entered when prompted for `Client Secret>`
    - `predix.zoneId` you obtain as an output of the command above as a property `zone.http-header-value` which looks like `kj1234j4-12k2-4cd3-1233-12k12k22133k`.


#### Verification of Predix Services configuration

After all values like `predix.*` are configured, you can check it locally by running the next commands:
- `npm i` - to install dependencies
- `npm run data:view` - to show saved data

If everything is ok, it has to return an empty array (means there is no data yet). If something going wrong it will return an error.


### Google Maps API

First login at https://developers.google.com.

For server side proceed to https://developers.google.com/places/web-service/.
- Click **GET A KEY** button.
- In popup select **Create a new project**, enter a project name and click **CREATE AND ENABLE PROJECT**.
- After that, you will get a key which provides access to **Google Places API Web Service**.
This value is for **server** config `google.places.key` value.

For client side proceed to https://developers.google.com/maps/documentation/javascript/. And make the same steps.
- Click **GET A KEY** button, select **Create a new project**, enter another project name and click **CREATE AND ENABLE PROJECT**.
- You will get a key which provides access to **Google Maps JavaScript API**.
- This value is for **client** config `GOOGLE_MAPS_KEY` value.

**NOTE**: In this setup, we create two different projects for client and server side, so the client side google API key gives access to the limited set of APIs. I think this level of security is enough for the POC project, but for production usage, we have to restrict these key's usage in the API Console, see [Best practices for securely using API keys](https://support.google.com/googleapi/answer/6310037?hl=en_US).


## Run locally

To run locally make sure you've completed setup section above and install npm dependencies by `npm i`.

To run in development mode:
- `npm run dev` - run server which also uses webpack-dev-middleware to serve client code from memory and enable HMR.

To run in production mode:
- `npm run build` - builds client code to the `dist` directory
- `npm start` - run server which also servers client side from `dist` directory

Navigate to http://localhost:3000/ if you didn't change port number by setting `PORT` environment variable.


## Deploy to Predix Cloud

Define `applications[0].name` in `/manifest.yml` first. You can use any value as long as it's unique for Predix and can be a part of the domain name.
It will be a part of service url, which will looks like `https://${applications[0].name}.run.aws-usw02-pr.ice.predix.io`.

In the project directory run the following commands using console:
- `px login` - login to Predix, if you are not logged in yet
- `px push` - uploads code to the server, build and run the application in the cloud

`px push` will output some info, including your service domain in `urls` option which looks like `${applications[0].name}.run.aws-usw02-pr.ice.predix.io`. When open in browser, don't forget to add `https://`.

## Commands

Before running commands don't forget to complete setup and install npm dependencies.

| Command                    | Description |
|----------------------------|-------------|
| `npm run dev`              | starts server for development (watch changes with nodemon for server-side and with webpack for client-side) |
| `npm start`                | starts server for production (serves client side from `/dist` directory) |
| `npm run data:view`        | show saved requests with responses to Predix Asset Service, for test purposes |
| `npm run data:clear`       | remove saved to Predix Asset Service requests with responses, for test purposes |
| `npm run build`            | builds client side to `/dist` directory for production, it's invoked in postinstall process |
| `npm run build:dev`        | builds client side to `/dist` directory in development mode, without files minifications |
| `npm run lint`             | lint all js code with eslint |
| `npm run lint:fix`         | lint all js code with eslint and fix errors which could be fixed automatically |

## Verification

As far as I know, there are two US cities which CityIQ Service has information about traffic and pedestrian activity: **San Diego** and **Atlanta**.

To verify solution you can make various requests, choosing **Place Type** and defining location.<br>
To define location you can make a search by text query like `San Diego`. Or click on target icon near search field and after click on the map to define location manually.<br>
Bounds around location are always calculated automatically to make bounds reasonable for current location.<br>
Pressing **Analyze** button will send requests to the server, and response will be displayed on the map.

After that you can run in console:
- `npm run data:view` - to view saved to Predix Asset requests (objects are shown not fully)

In case you've made too many requests and it's hard to track them, you can run:
- `npm run data:clear` -  to remove all saved requests from Predix Asset


## Compatibility

This project has been developed using Mac OS and has to run smoothly on the Linux type system.
Although I don't see any reasons why it wouldn't run on Windows machine.
