import Web3 from 'web3';

// Connect to MetaMask
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

// Contract ABI and Address
const contractABI = [
    {
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
    }
];

const contractAddress = "0x003ACebcec25924bd3cC023D32C15fA6576e66c2"; // Replace with your contract address
const contract = new web3.eth.Contract(contractABI, contractAddress);

document.getElementById('createGroupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const participants = document.getElementById('participants').value.split(',').map(address => address.trim());
    const totalAmount = document.getElementById('totalAmount').value;

    if (!participants.length || !totalAmount) {
        alert('Please enter all fields.');
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.createGroup(participants, web3.utils.toWei(totalAmount, 'ether')).send({ from: accounts[0] });
        // Retrieve the latest group ID
        const groupCount = await contract.methods.groupCount().call();
        document.getElementById('groupID').innerText = `Group ID: ${groupCount}`;
        alert('Group created successfully!');
    } catch (error) {
        console.error("Error creating group:", error);
        alert('Failed to create group. Check console for details.');
    }
});

document.getElementById('payForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const groupId = document.getElementById('groupIdPay').value;
    const paymentAmount = document.getElementById('paymentAmount').value;

    if (!groupId || !paymentAmount) {
        alert('Please enter all fields.');
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.pay(groupId).send({ from: accounts[0], value: web3.utils.toWei(paymentAmount, 'ether') });
        alert('Payment successful!');
    } catch (error) {
        console.error("Error making payment:", error);
        alert('Failed to make payment. Check console for details.');
    }
});

document.getElementById('checkPaymentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const groupId = document.getElementById('groupIdCheck').value;
    const participantAddress = document.getElementById('participantAddress').value;

    if (!groupId || !participantAddress) {
        alert('Please enter all fields.');
        return;
    }

    try {
        const paymentAmount = await contract.methods.checkPayment(groupId, participantAddress).call();
        alert(`Payment Amount: ${web3.utils.fromWei(paymentAmount, 'ether')} ETH`);
    } catch (error) {
        console.error("Error checking payment:", error);
        alert('Failed to check payment. Check console for details.');
    }
});

document.getElementById('distributeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const groupId = document.getElementById('groupIdDistribute').value;

    if (!groupId) {
        alert('Please enter the Group ID.');
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.distribute(groupId).send({ from: accounts[0] });
        alert('Payments distributed successfully!');
    } catch (error) {
        console.error("Error distributing payments:", error);
        alert('Failed to distribute payments. Check console for details.');
    }
});
