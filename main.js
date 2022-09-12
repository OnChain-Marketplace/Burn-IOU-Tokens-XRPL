//DEPENDANCIES
const xrpl = require(`xrpl`)
const fs = require('fs')

//FUNCTIONS
const {
    wait
} = require(`./functions/wait`)
const {
    comma
} = require(`./functions/comma`)
const {
    getAllTLs
} = require(`./functions/getAllTLs`)

//config
const {
    nodes,
    cycleFrequency,
    accounts
} = require(`./config.json`)

//CLIENTS
let xrplClient = new xrpl.Client(nodes[0])

//ERROR HANDLING
process.on('unhandledRejection', async (reason, promise) => {
    var error = `Unhandled rejection at, ${promise}, reason: ${reason}`;
    console.log(error)
    fs.appendFileSync(`./ERRORs.txt`, `\n. _ . _ .\n. _ . _ .\nUnhandled Rejection: ${error}\nTime: ${new Date(Date.now())}`)

    //DISCONNECT CLIENTS
    await xrplClient.disconnect()
    process.exit(1)
});
process.on('uncaughtException', async (err) => {
    console.log(`Uncaught Exception: ${err.message}`)
    fs.appendFileSync(`./ERRORs.txt`, `\n. _ . _ .\n. _ . _ .\nUncaught Exception: ${err.message}\nTime: ${new Date(Date.now())}`)

    //DISCONNECT CLIENTS
    await xrplClient.disconnect()
    process.exit(1)
});


//MAIN FUNCTION 
async function main() {

    console.log(`\n\nThis open-source script was developed for free use by OnChain Markeplace\n\tForging a new era of trustless and open trading with NFTokens on the XRPL.\n\tBoasting NO trading fees, and low listing fees, OCM suits both projects and individuals\nVisit https://onchainmarketplace.net/ to learn more\n\tFeel free to contact us with any queries or concerns.`)

    //warning 
    var text = `\n\n<< WARNING >> << WARNING >> << WARNING >> << WARNING >> << WARNING >>\nBy Allowing This Script To Run, YOU Are Burning The Following Assets\n`
    for (a in accounts) {
        var wallet = xrpl.Wallet.fromSeed(accounts[a].seed).classicAddress
        if (accounts[a].hexBURN.length > 3) {
            var name = xrpl.convertHexToString(accounts[a].hexBURN)
        } else {
            var name = accounts[a].hexBURN
        }
        text += `\n\tWallet: ${wallet}\n\t\tToken: $${name}\n\t\tIssuer: ${accounts[a].issuerBURN}`
    }
    text += `\n\nThis Action Is NOT Reversible\nYou WILL Lose All The Assets Listed Above!\nProceed With Caution!\n\nYou Have 30 Seconds to confirm...\n<< Press "CTRL + C" To Cancel >>`
    console.log(text)
    await wait(30)

    //connect to XRPL
    var count = 0
    while (true) {

        if (count == nodes.length) {
            console.log(`FAILED TO CONNECT TO ANY XRPL CLIENTS`)
            process.exit(1)
        }

        try {
            await xrplClient.connect()
        } catch (error) {
            console.log(`\nFailed to Connect #${count}\n${error}`)
        }

        if (xrplClient.isConnected()) break
        count += 1
        xrplClient = new xrpl.Client(nodes[count])
    }
    console.log(`\n\n\nConnected to: ${xrplClient.connection.ws._url}`)

    //cycle of burning 
    console.log(`\n__Beginning Burn Cycle__`)
    var count = 0
    while (true) {
        count += 1
        console.log(`\n<< Burn Cycle #${count} >>`)

        for (a in accounts) {
            //define variables
            var wallet = xrpl.Wallet.fromSeed(accounts[a].seed)
            var hex = accounts[a].hexBURN
            var issuer = accounts[a].issuerBURN
            var memo = xrpl.convertStringToHex(accounts[a].memo)
            var destinationTag = accounts[a].destinationTag
            if (accounts[a].hexBURN.length > 3) {
                var name = xrpl.convertHexToString(accounts[a].hexBURN)
            } else {
                var name = accounts[a].hexBURN
            }
            console.log(`__$${name}__\n\tWallet: ${wallet.classicAddress}\n\tToken Issuer: ${issuer}\n\tToken Hex: ${hex}`)

            //find holdings
            var trustlines = await getAllTLs(xrplClient, wallet.classicAddress, "validated")

            var holds = 0
            for (b in trustlines) {
                if (trustlines[b].account != issuer) continue
                if (trustlines[b].currency != hex) continue
                var holds = trustlines[b].balance
            }
            console.log(`\tHolds ${comma(holds)} $${name}`)


            //burn tokens
            if (holds > 0) {
                console.log(`\n\t\tBURNING ${comma(holds)} $${name} From ${wallet.classicAddress}`)

                var preparedTx = await xrplClient.autofill({
                    "TransactionType": "Payment",
                    "Account": wallet.classicAddress,
                    "Destination": issuer,
                    "DestinationTag": Number(destinationTag),
                    "Flags": 131072,
                    "Amount": {
                        "currency": hex,
                        "value": holds,
                        "issuer": issuer
                    },
                    "Memos": [{
                        "Memo": {
                            "MemoData": memo
                        }
                    }]

                })

                var signedTx = wallet.sign(preparedTx)
                var submittedTx = await xrplClient.submitAndWait(signedTx.tx_blob)
                console.log(`\n\t\t\t${submittedTx.result.meta.TransactionResult} -> ${signedTx.hash}`)
            }
        }
        console.log(`Finished, waiting ${comma(cycleFrequency)} seconds before repeating`)
        await wait(cycleFrequency)
    }
}

main()