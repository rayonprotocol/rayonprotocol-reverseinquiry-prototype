pragma solidity ^0.4.22;


contract User {

    // structs
    struct UserStruct {
        uint index;
        string userName;
        bool isBorrower;
    }

    // variables
    mapping (address => UserStruct) public userList;
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
        return (
            userList[_userAddress].userName, 
            userList[_userAddress].isBorrower
        );
    }

    function getUserAddressList() public view returns(address[]) {
        return userAddressList;
    }

    function signUp(
        string _userName,
        bool _isBorrower
    ) public {
        address userAddress = msg.sender;
        // validation
        require(!isUser(userAddress));
        
        // make new user infomation
        userList[userAddress] = UserStruct(userAddressList.push(userAddress), _userName, _isBorrower);

        emit LogSignUpUser(
            userAddress,
            _userName,
            _isBorrower
        );
    }
}
