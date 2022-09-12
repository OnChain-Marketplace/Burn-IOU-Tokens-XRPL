# Burn-IOU-Tokens-XRPL
 This simple script will cycle and burn any defined tokens that are transferred to/held by the defined addresses.
 It will burn ALL of the defined tokens (but will not burn tokens that aren't defined in `config.json`).

 A main application of this script is to automate token burning for projects running an NFToken redemption for an IOU token.
 This script has been custom built in conjunction with the [OnChain Marketplace](https://onchainmarketplace.net/) [IOU Redemption Function](https://github.com/tatejuan12/OCM-Redeem-API).

 This script can function as a continuously run file (i.e. hosted on a server), or it can be manually run intermittedly (i.e. from a local computer). Set-up choice is dependant on user preference and knowledge.

 ### Overview
 This script will scan the defined addresses for defined tokens. If a token is found to be held, the script will *burn* the token. The script will repeat this cycle of checking and burning indefinitely. 

 Token Burning is executed by sending the token back to the issuing address. This removes it from the wallet, and effectively from circulation (especially if the issuer is [blackholed](https://xrpl.org/accounts.html)).

 This process is permanent! It can **NOT** be reversed. **ALL** defined tokens will be lost.

 Take care when setting up this script, and ensure to review the code yourself. **YOU** are soley responsible for it's actions.

 ### Configuring the Script
 ##### Configuration File
  *These are the details to be configured in `config.json`*
 ```
{
    "nodes": [  "wss://xls20-sandbox.rippletest.net:51233" ],
    "cycleFrequency": 60,
    "accounts": [
        {
            "seed": "sEXAMPLESEED",
            "hexBURN": "OCW",
            "issuerBURN": "rK9DrarGKnVEo2nYp5MfVRXRYf5yRX3mwD",
            "memo": "This transaction is to burn the $OCW IOU token, which has been redeemed for it's corresponding NFToken.",
            "destinationTag": 101
        }
    ]
}
 ```
  1. **nodes** -> An array of websocket connections to the XRPL. The order determines the sequence in which attempts to connect are made. Public XRPL websockets can be found [here](https://xrpl.org/public-servers.html#public-servers).
  2. **cycleFrequency** -> A number, which indicates the number of seconds between cycles. The script will pause all actions during this period.
  3. **accounts** -> An array, containing all the defined accounts and tokens to be monitored. An individual array element is required, for each token, containing the following details.
     - *seed* -> This should be the XRPL family seed of the account to be monitored.
     - *hexBURN* -> This is the hexadecimal name of the token to be burnt. This must be formatted correctly as seen [here](https://xrpl.org/currency-formats.html#currency-codes)!
     - *issuerBURN* -> This is the issuing address of the token to be burnt. This is also the address to which the token will be sent/burnt to.
     - *memo* -> A string to be attached to each transaction burning this token. This should concisely explain the purpose of this transaction to avoid confusion.
     - *destinationTag* -> A whole number, which can be used to quickly label transactions for your later reference.

 ### Extra
 This software was developed for free use by [OnChain Marketplace](https://onchainmarketplace.net/). 
 OCM boasts the most decentralised and open NFToken Marketplace on the XRPL, and has the lowest known fee for interacting and trading.
 Feel free to vist [OCM](https://onchainmarketplace.net/), and experience a new era of NFToken trading.

 To learn more about the XRPL visit [here](https://xrpl.org/).
 To learn specifics about tokens on the XRPL, visit [here](https://xrpl.org/tokens.html#tokens).

 ### Dependencies
 This script utilises npm packages.
 [xrpl](https://www.npmjs.com/package/xrpl)
