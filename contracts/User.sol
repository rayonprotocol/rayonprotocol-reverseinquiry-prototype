pragma solidity ^0.4.22;


contract User {

    // structs
    struct UserStruct {
        uint index;
        string userName;
        bool isPersonal;
        bool isPassKyc;
        bool isExist;
    }

    // variables
    mapping (address => UserStruct) public userList;
    address[] userAddressList;

    // events
    event LogSignUpUser (address userAddress, string userName, bool isPersonal);
    event LogAuthUser (bool isPassKyc);

    function isUser(address _userAddress) public view returns(bool) {
        return (userList[_userAddress].isExist);
    }

    function getUser(address _userAddress) public view returns(string, bool, bool, bool) {
        return (
            userList[_userAddress].userName,
            userList[_userAddress].isPersonal,
            userList[_userAddress].isPassKyc,
            userList[_userAddress].isExist
        );
    }

    function signUpUser(
        string _userName,
        bool _isPersonal
        ) public returns(bool) {
        address userAddress = msg.sender;
        // validation
        if (isUser(userAddress)) return false;
        userList[userAddress].userName = _userName;
        userList[userAddress].isPersonal = _isPersonal;
        userList[userAddress].isPassKyc = false;
        userList[userAddress].index = userAddressList.push(userAddress)-1;
        userList[userAddress].isExist = true;
        // event
        emit LogSignUpUser(
            userAddress,
            _userName,
            _isPersonal);
        return true;
    }

    function authUser(
        address _userAddress
    ) public returns(bool) {
        userList[_userAddress].isPassKyc = true;
        emit LogAuthUser(true);
        return true;
    }
}
