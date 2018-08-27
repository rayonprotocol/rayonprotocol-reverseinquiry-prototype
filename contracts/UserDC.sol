pragma solidity ^0.4.22;


contract UserDC { 

    struct User {
        uint index; // isUser 메소드를 위해 사용됨
        string userName;
        bool isBorrower;
    }

    mapping (address => User) public users;
    address[] public userList;

    event LogUserSignUp(address userAddress, string userName, bool isBorrower);

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
        require(!isUser(userAddress));
        
        users[userAddress] = User(userList.push(userAddress), _userName, _isBorrower);

        emit LogUserSignUp(userAddress, _userName, _isBorrower);
    }
}
