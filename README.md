# Privatar

Privatar is a web3 Gravatar clone dapp that is used as the subject of a tutorial.

## Description

Privatar is a Gravatar clone dapp that allows users to upload an avatar and profile info which can be retrieved via API endpoints and used as a form of identity for a user's wallet address.

## Table of Contents

- [Project Title](#privatar)
- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Live Demo](#live-demo-site)
- [License](#license)

## Getting Started

To build and deploy this project for yourself, you'll need to first deploy the Privatar solidity contract, then use the deployment address and output ABI within the Svelte frontend.

### Prerequisites

- Metamask
- NodeJS

The dapp is currently built assuming users have the Metamask Web3 Wallet extension and has not been tested with other wallets.

NodeJS with npm is used for project dependencies.

### Installation

From the project root use npm to install dependencies.

`npm install`

Add a .env file to the project root with a single entry `PRIVATE_KEYS` and add at least 1 private key that will be used for deploying the contract to Oasis Sapphire Testnet.

Use hardhat commands to compile the solidity contracts via:

`npx hardhat compile`

Run unit tests against the hardhat network, use:

`npx hardhat test` or `npx hardhat coverage`

To deploy the contract, ensure that the private key account added to the .env file has some Sapphire TEST tokens (can be acquired from the [faucet](https://faucet.testnet.oasis.dev/)) and run the following script via hardhat:

`npx hardhat run scripts/deploy.ts --network sapphire_testnet`

The output from that script will display the address of the deployed contract.  In order to use the contract in the frontend, copy that address and add it as the value of the the `Privatar` JSON key inside `~\frontend\src\lib\contracts\contract-address.json` 
like `{ "Privatar": "{{put contract address here}}" }`

Then copy the output JSON ABI file from `~\artifacts\contracts\Privatar.sol\Privatar.json` and place it in the `~\frontend\src\lib\contracts\` folder, overwritting the existing file.  You'll need to do this any time you make changes to the contract.

To prepare and start the SvelteKit frontend, change to the front end folder `frontend`, use npm to install dependencies and start the vite hotloader.

`cd frontend`

`npm install`

`run dev -- --open`

## Usage

With the dapp running locally in a browser with Metamask installed, use the "Connect" button in the top right corner to connect your wallet to the Sapphire Testnet.  You may upload an avatar and profile data.

Use the refresh button after uploading data to pull down the latest profile data.  

Note: The refresh button requires a signature as it uses `msg.sender` in the contract function. 

Once your avatar and profile is uploaded, you can use the `/{wallet address}` and `/avatar/{wallet address}` endpoints to retrieve the profile and avatar, respectively.

### Live Demo Site

A live demo can be seen at:

https://privatar.brosette.dev/
or
https://sunny-trifle-f9b110.netlify.app/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

