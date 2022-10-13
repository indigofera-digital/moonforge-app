# Immutable X integration example
This is a skeleton React app for the purpose of providing code examples for building a marketplace on Immutable X. It covers:
- View sell orders and buying NFTs
- View Immutable X inventory and ETH balance
- Creating and cancelling sell orders
- Minting on Immutable X
- Depositing and withdrawing ETH and NFTs

## Polling
If you want to maintain a state of the entire Immutable X ecosystem in a local database, you currently have to poll our API endpoints and update events in your database accordingly. We will be looking at adding webhooks in the future.


| Endpoint  | Action |
| ---  | --- |
| `/mints` | Insert new asset |
| `/transfers` | Update asset ownership |
| `/trades` | Update asset ownership |
| `/orders` | Add and update orders |
| `/withdrawals` | Set asset status to eth / update balance |
| `/deposits` | Set asset status to imx / update balance |


## Available Scripts

In the project directory, you can run:

### `yarn install`

This downloads and installs the required packages.

### `npx yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


## Amplify deploy

1. Run the command `amplify init` to initialize the application
2. Run the command `amplify add hosting` to initiate the creation of hosting for the application.  Use the following options:
```
    Select the plugin module to execute: Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)
    Choose a type: Manual deployment 
```
3. Run the command `amplify publish` to publish your application.  Amplify will return a URL like "https://dev.[amplifyid].amplify.com" where you can see the running application.


You may get an "AccessDenied" error if your app's distribution directory is not set properly. To fix this, change the distribution directory via amplify configure project and then re-run amplify publish.

To view your app and hosting configuration in the Amplify Console, run the amplify console command.

Note: In order to delete all the environments of the project from the cloud and wipe out all the local files created by Amplify CLI, run amplify delete command. Now, to observe that your Amplify project resources have been deleted, run amplify status command.

