const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(`https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

// Contract ABI and address (obtained from deployment)
const contractABI = [{
        "inputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "contributions",
        "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "groupCount",
        "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
        "name": "groups",
        "outputs": [
            { "internalType": "address payable", "name": "creator", "type": "address" },
            { "internalType": "uint256", "name": "totalAmount", "type": "uint256" },
            { "internalType": "uint256", "name": "balance", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [ { "internalType": "address[]", "name": "_participants", "type": "address[]" }, { "internalType": "uint256", "name": "_totalAmount", "type": "uint256" } ],
        "name": "createGroup",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [ { "internalType": "uint256", "name": "_groupId", "type": "uint256" } ],
        "name": "pay",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [ { "internalType": "uint256", "name": "_groupId", "type": "uint256" }, { "internalType": "address", "name": "_participant", "type": "address" } ],
        "name": "checkPayment",
        "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [ { "internalType": "uint256", "name": "_groupId", "type": "uint256" } ],
        "name": "distribute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }];
const contractAddress = '0x...';  // Deployed contract address

const groupPayment = new web3.eth.Contract(contractABI, contractAddress);

// Example: Create a group
async function createGroup() {
    const accounts = await web3.eth.getAccounts();
    const participants = ['0xparticipant1...', '0xparticipant2...'];
    const totalAmount = web3.utils.toWei('5', 'ether');

    await groupPayment.methods.createGroup(participants, totalAmount).send({
        from: accounts[0],
    });
}

// Example: Pay into the group
async function payGroup(groupId) {
    const accounts = await web3.eth.getAccounts();
    await groupPayment.methods.pay(groupId).send({
        from: accounts[0],
        value: web3.utils.toWei('1', 'ether'),
    });
}

// Example: Distribute payment
async function distributePayment(groupId) {
    const accounts = await web3.eth.getAccounts();
    await groupPayment.methods.distribute(groupId).send({
        from: accounts[0],
    });
}
