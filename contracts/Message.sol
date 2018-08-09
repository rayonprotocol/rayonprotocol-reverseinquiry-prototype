pragma solidity ^0.4.22;
import "./RayonAuction.sol";
import "./libraries/strings.sol";
import "./RayonUser.sol";

contract Message {
    using strings for *;

    struct Msg {
        address fromAddress;
        address toAddress;
        uint auctionId;
        uint msgType;
        string payload;
        uint timeStamp;
        uint msgIndex;
        bool isComplete;
    }

    RayonAuction auction;

    Msg[] msgs;

    // events
    event LogInsterMessage(address fromAddress, address toAddress, uint auctionId, uint msgType, string payload);

    constructor (address _auctionContractAddress) public {
        auction = RayonAuction(_auctionContractAddress);
    }

    // function insertStartMessage(
    //     address _toAddress,
    //     uint _auctionId,
    //     uint _msgType,
    //     string _payload
    // ) public returns (bool) {
    //     pushMessage(_toAddress, _auctionId, _msgType, _payload);
    //     return true;
    // }

    // function insertMessage(
    //     address _toAddress,
    //     uint _auctionId,
    //     uint _msgType,
    //     uint _previousMsgIndex,
    //     string _payload
    // ) public returns (bool) {   
    //     pushMessage(_toAddress, _auctionId, _msgType, _payload); 
    //     setComplete(_previousMsgIndex);        
    //     return true;
    // }

    // function pushMessage(
    //     address _toAddress,
    //     uint _auctionId,
    //     uint _msgType,
    //     string _payload
    // ) public {
    //     address _fromAddress = msg.sender;
    //     uint timeStamp;
    //     (,,,,timeStamp) = auction.contentList(_auctionId);
    //     require(timeStamp != 0);

    //     Msg memory _msg = Msg(_fromAddress, _toAddress, _auctionId, _msgType, _payload, now, msgs.length, false);
    //     msgs.push(_msg);
    //     emit LogInsterMessage(_fromAddress, _toAddress, _auctionId, _msgType, _payload);
    // }

    function setComplete(uint _msgIndex) public returns(bool){
        msgs[_msgIndex].isComplete = true;
        return true;
    }

    function getMessageAddresses() public view returns(
        address[],
        address[]
    ){
        address[] memory fromAddresses = new address[](msgs.length);
        address[] memory toAddresses = new address[](msgs.length);
        for(uint i = 0; i < msgs.length; i++) {
            fromAddresses[i] = msgs[i].fromAddress;
            toAddresses[i] = msgs[i].toAddress;
        }
        
        return (fromAddresses, toAddresses);
    }


    function getUserMessages() public view returns(
        uint[],
        uint[],
        uint[],
        uint[],
        bool[],
        string
    ) {
        uint[] memory msgIndexes = new uint[](msgs.length);
        uint[] memory auctionIds = new uint[](msgs.length);
        uint[] memory msgTypes = new uint[](msgs.length);
        uint[] memory timeStamps = new uint[](msgs.length);
        bool[] memory isCompletes = new bool[](msgs.length);
        strings.slice[] memory payloads = new strings.slice[](msgs.length);
        for(uint i = 0; i < msgs.length; i++) {
            msgIndexes[i] = msgs[i].msgIndex;
            auctionIds[i] = msgs[i].auctionId;
            msgTypes[i] = msgs[i].msgType;
            timeStamps[i] = msgs[i].timeStamp;
            isCompletes[i] = msgs[i].isComplete;
            payloads[i] = msgs[i].payload.toSlice();
        }
        
        return (msgIndexes, auctionIds, msgTypes, timeStamps, isCompletes,"||".toSlice().join(payloads));
    }
}
