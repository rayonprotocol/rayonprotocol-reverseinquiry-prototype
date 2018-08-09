pragma solidity ^0.4.22;


contract RayonUser {

    // structs
    struct User {
        uint index;
        string userName;
        bool isBorrower;
    }

    // variables
    mapping (address => User) public userList;
    address[] userAddressList;

    // events
    event LogSignUpUser (address userAddress, string userName, bool isBorrower);

    /*
    functions
    */
    function isUser(address _userAddress) public view returns(bool) {
        return (userList[_userAddress].index > 0);
    }

    function getUser(address _userAddress) public view returns(string, bool) {
        require(isUser(_userAddress));
        return (
            userList[_userAddress].userName,
            userList[_userAddress].isBorrower
        );
    }

    function signUp(
        string _userName,
        bool _isBorrower
    ) public {
        address userAddress = msg.sender;
        // validation
        require(!isUser(userAddress));
        
        // make new user infomation
        userList[userAddress] = User(userAddressList.push(userAddress), _userName, _isBorrower);

        // emit event
        emit LogSignUpUser(
            userAddress,
            _userName,
            _isBorrower
        );
    }
}
