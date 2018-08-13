pragma solidity ^0.4.22;
import "./RayonAuction.sol";
import "./libraries/strings.sol";
import "./RayonUser.sol";

contract RayonAuctionMessage {
    using strings for *;

    // constant variable
    uint constant REQUEST_PERSONAL_DATA = 1;
    uint constant RESPONSE_PERSONAL_DATA = 2;
    uint constant OFFER_PRODUCT = 3;
    uint constant ACCEPT_OFFER = 4;
    uint constant DENY_OFFER = 5;

    // structs
    struct AuctionMessage {
        uint messageId;
        address fromAddress;
        address toAddress;
        uint msgType;
        string payload;
        uint timeStamp;
        bool isComplete;
    }

    // variable
    mapping (uint => AuctionMessage[]) public auctionMessages;  // key: auction id

    // events
    event LogSendAuctionMessage(uint auctionId, uint messageId, address fromAddress, address toAddress, uint msgType, string payload, uint timeStamp, bool isComplete);

    function setMessageComplete(uint _auctionId,uint _messageId) public {
        auctionMessages[_auctionId][_messageId].isComplete = true;
    }

    function sendMessage(
        uint _auctionId,
        uint _messageId,
        address _toAddress,
        uint _msgType,
        string _payload
    ) public {
        uint newMessageId = auctionMessages[_auctionId].length;
        uint timeStamp = now;
        address fromAddress = msg.sender;

        auctionMessages[_auctionId].push(AuctionMessage(newMessageId, fromAddress, _toAddress, _msgType, _payload, timeStamp, false));

        if(_msgType != REQUEST_PERSONAL_DATA) {
            setMessageComplete(_auctionId, _messageId);
        }

        emit LogSendAuctionMessage(_auctionId, newMessageId, fromAddress, _toAddress, _msgType, _payload, timeStamp, false);
    }

    function getMessage(uint _auctionId,uint _messageId) public view returns(
        uint,
        uint,
        address,
        address,
        uint,
        string,
        uint,
        bool
    ) {
        require(_messageId < auctionMessages[_auctionId].length);
        AuctionMessage memory auctionMessage = auctionMessages[_auctionId][_messageId];
        return (
            _auctionId,
            auctionMessage.messageId,
            auctionMessage.fromAddress,
            auctionMessage.toAddress,
            auctionMessage.msgType,
            auctionMessage.payload,
            auctionMessage.timeStamp,
            auctionMessage.isComplete
        );
    }

    function getMessagesLength(uint _auctionId) public view returns(uint) {
        return auctionMessages[_auctionId].length;
    }
}
