pragma solidity ^0.4.22;
import "./ReverseInquiryDC.sol";
import "./libraries/strings.sol";
import "./UserDC.sol";

contract ReverseInquiryMessageDC {
    using strings for *;

    uint constant MESSAGE_REQUESTPERSONALDATA = 1;
    uint constant MESSAGE_RESPONSEPERSONALDATA = 2;
    uint constant MESSAGE_OFFERPROPOSAL = 3;
    uint constant MESSAGE_ACCEPTOFFER = 4;
    uint constant MESSAGE_DENY_OFFER = 5;

    struct ReverseInquiryMessage {
        uint messageId;
        address fromAddress;
        address toAddress;
        uint messageType;
        string content;
        bool isComplete;
        uint insertTime;
    }

    mapping (uint => ReverseInquiryMessage[]) public reverseInquiryMessages;

    // privious message의 done 표시를 위해 reverseInquiryId이 필요
    event LogSendReverseInquiryMessage(uint reverseInquiryId, uint messageId, address fromAddress, address toAddress, uint msgType, string content, uint insertTime, bool isComplete);

    function setMessageComplete(uint _reverseInquiryId, uint _messageId) public {
        reverseInquiryMessages[_reverseInquiryId][_messageId].isComplete = true;
    }

    function sendMessage(uint _reverseInquiryId, uint _messageId, address _toAddress, uint _msgType, string _content) public {
        uint newMessageId = reverseInquiryMessages[_reverseInquiryId].length;
        uint currentTime = now;
        address fromAddress = msg.sender;

        reverseInquiryMessages[_reverseInquiryId].push(ReverseInquiryMessage(newMessageId, fromAddress, _toAddress, _msgType, _content, false, currentTime));

        if(_msgType != MESSAGE_REQUESTPERSONALDATA) {
            setMessageComplete(_reverseInquiryId, _messageId);
        }

        emit LogSendReverseInquiryMessage(_reverseInquiryId, newMessageId, fromAddress, _toAddress, _msgType, _content, currentTime, false);
    }

    function getMessage(uint _reverseInquiryId,uint _messageId) public view returns(uint, uint, address, address, uint, string, uint, bool
    ) {
        require(_messageId < reverseInquiryMessages[_reverseInquiryId].length);
        ReverseInquiryMessage memory reverseInquiryMessage = reverseInquiryMessages[_reverseInquiryId][_messageId];
        return (
            _reverseInquiryId,
            reverseInquiryMessage.messageId,
            reverseInquiryMessage.fromAddress,
            reverseInquiryMessage.toAddress,
            reverseInquiryMessage.messageType,
            reverseInquiryMessage.content,
            reverseInquiryMessage.insertTime,
            reverseInquiryMessage.isComplete
        );
    }

    function getMessagesLength(uint _reverseInquiryId) public view returns(uint) {
        return reverseInquiryMessages[_reverseInquiryId].length;
    }
}
