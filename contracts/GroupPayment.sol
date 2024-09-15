// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GroupPayment {
    struct Group {
        address payable creator;
        uint totalAmount;
        address[] participants;
        uint balance;
    }

    mapping(uint => Group) public groups;
    mapping(uint => mapping(address => uint)) public contributions; // Separate mapping for contributions
    uint public groupCount;

    // Create a new group
    function createGroup(address[] memory _participants, uint _totalAmount) public {
        groupCount++;
        Group storage newGroup = groups[groupCount];
        newGroup.creator = payable(msg.sender);
        newGroup.totalAmount = _totalAmount;
        newGroup.participants = _participants;
        newGroup.balance = 0;
    }

    // Make payment to the group
    function pay(uint _groupId) public payable {
        Group storage group = groups[_groupId];
        require(msg.value > 0, "Payment must be greater than zero.");
        require(isParticipant(_groupId, msg.sender), "Not a group participant.");

        contributions[_groupId][msg.sender] += msg.value;
        group.balance += msg.value;
    }

    // Check payment status
    function checkPayment(uint _groupId, address _participant) public view returns (uint) {
        return contributions[_groupId][_participant];
    }

    // Distribute payments
    function distribute(uint _groupId) public {
        Group storage group = groups[_groupId];
        require(group.balance >= group.totalAmount, "Insufficient funds.");
        
        group.creator.transfer(group.balance);
        group.balance = 0;
    }

    function isParticipant(uint _groupId, address _participant) internal view returns (bool) {
        Group storage group = groups[_groupId];
        for (uint i = 0; i < group.participants.length; i++) {
            if (group.participants[i] == _participant) {
                return true;
            }
        }
        return false;
    }
}
