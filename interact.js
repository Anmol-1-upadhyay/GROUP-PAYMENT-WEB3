const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(`https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

// Contract ABI and address (obtained from deployment)
const contractABI = [/* ABI from compile output */];
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
