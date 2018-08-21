pragma solidity ^0.4.22;


contract UserDC { 

    // structs
    struct User {
        uint index;
        string userName;
        bool isBorrower;
    }

    // variables
    mapping (address => User) public users;
    address[] public userList;

    // events
    event LogUserSignUp(address userAddress, string userName, bool isBorrower);

    /*
    functions
    */
    function isUser(address _userAddress) public view returns(bool) {
        return (users[_userAddress].index > 0);
    }

    function getUser(address _userAddress) public view returns(string, bool) {
        require(isUser(_userAddress));
        return (
            users[_userAddress].userName,
            users[_userAddress].isBorrower
        );
    }

    function signUp(string _userName, bool _isBorrower) public {
        address userAddress = msg.sender;
        // validation
        require(!isUser(userAddress));
        
        // make new user infomation
        users[userAddress] = User(userList.push(userAddress), _userName, _isBorrower);

        // emit event
        emit LogUserSignUp(userAddress, _userName, _isBorrower);
    }
}
