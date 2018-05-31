pragma solidity ^0.4.22;
import "./Auction.sol";
import "./libraries/strings.sol";

contract Message {
    using strings for *;

    struct Msg {
        address fromAddress;
        address toAddress;
        uint auctionId;
        uint msgType;
        string payload;
        uint timeStamp;
    }

    struct MsgRelationship {
        uint[] msgIndexes;
        bool isExist;
    }

    Auction auction;

    Msg[] msgs;

    // events
    event LogInsterMessage(address fromAddress, address toAddress, uint auctionId, uint msgType, string payload);

    constructor (address _auctionContractAddress) public {
        auction = Auction(_auctionContractAddress);
    }

    mapping(address => MsgRelationship) userToMsgRelationship;

    function addMsgRelationship(address _fromAddress, address _toAddress, uint _msgIndex) private returns(bool) {
        if (userToMsgRelationship[_fromAddress].isExist) {
            userToMsgRelationship[_fromAddress].msgIndexes.push(_msgIndex);
        } else {
            userToMsgRelationship[_fromAddress].msgIndexes = [_msgIndex];
            userToMsgRelationship[_fromAddress].isExist = true;
        }

        if (userToMsgRelationship[_toAddress].isExist) {
            userToMsgRelationship[_toAddress].msgIndexes.push(_msgIndex);
        } else {
            userToMsgRelationship[_toAddress].msgIndexes = [_msgIndex];
            userToMsgRelationship[_toAddress].isExist = true;
        }
        return true;
    }
    function insertMessage(
        address _toAddress,
        uint _auctionId,
        uint _msgType,
        string _payload
    ) public returns (bool) {
        address _fromAddress = msg.sender;
        uint timeStamp;
        (,,,,timeStamp) = auction.contentList(_auctionId);
        require(timeStamp != 0);

        Msg memory _msg = Msg(_fromAddress, _toAddress, _auctionId, _msgType, _payload, now);
        uint msgIndex = msgs.push(_msg) - 1;
        emit LogInsterMessage(_fromAddress, _toAddress, _auctionId, _msgType, _payload);
        return addMsgRelationship(_fromAddress, _toAddress, msgIndex);
    }


    function getUserMessages() public view returns(
        address[],
        address[],
        uint[],
        uint[],
        uint[],
        string
    ) {
        address _userAddress = msg.sender;
        if (userToMsgRelationship[_userAddress].isExist) {
            uint[] memory msgIndexes = userToMsgRelationship[_userAddress].msgIndexes;
            address[] memory fromAddresses = new address[](msgIndexes.length);
            address[] memory toAddresses = new address[](msgIndexes.length);
            uint[] memory auctionIds = new uint[](msgIndexes.length);
            uint[] memory msgTypes = new uint[](msgIndexes.length);
            uint[] memory timeStamps = new uint[](msgIndexes.length);
            strings.slice[] memory payloads = new strings.slice[](msgIndexes.length);
            for(uint i = 0; i < msgIndexes.length; i++) {
                uint msgIndex = msgIndexes[i];
                fromAddresses[i] = msgs[msgIndex].fromAddress;
                toAddresses[i] = msgs[msgIndex].toAddress;
                auctionIds[i] = msgs[msgIndex].auctionId;
                msgTypes[i] = msgs[msgIndex].msgType;
                timeStamps[i] = msgs[msgIndex].timeStamp;
                payloads[i] = msgs[msgIndex].payload.toSlice();
            }
        }
        return (fromAddresses, toAddresses, auctionIds, msgTypes, timeStamps, "||".toSlice().join(payloads));
    }
}
