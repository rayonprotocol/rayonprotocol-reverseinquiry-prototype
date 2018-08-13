pragma solidity ^0.4.22;
import "./libraries/strings.sol";

contract RayonAuction {
    using strings for *;

    // structs
    struct AuctionContent {
        uint id;
        string title;
        string content;
        string financeData;
        string userName;
        address userAddress;
        uint timeStamp;
    }

    // variables
    AuctionContent[] auctionContents;

    // events
    event LogRegisterAuctionContent(uint id, string title, string content, string financeData, string userName, address userAddress, uint timeStamp);

    function registerAuctionContent(
        string _title,
        string _content,
        string _financeData,
        string _userName
    ) public {
        uint contentId = auctionContents.length;
        uint timeStamp = now;
        address userAddress = msg.sender;

        auctionContents.push(AuctionContent(contentId, _title, _content, _financeData, _userName, userAddress, timeStamp)) - 1;

        emit LogRegisterAuctionContent(contentId, _title, _content, _financeData, _userName, userAddress, timeStamp);
    }

    function getContent(uint contentIndex) public view returns(
        uint,
        string,
        string,
        string,
        string,
        address
        // uint
    ){
        require(contentIndex < auctionContents.length);
        AuctionContent memory auctionContent = auctionContents[contentIndex];
        return (
            auctionContent.id,
            auctionContent.title,
            auctionContent.content,
            auctionContent.financeData,
            auctionContent.userName,
            auctionContent.userAddress
            // auctionContent.timeStamp
        );
    }

    function getContentsLength() public view returns(uint) {
        return auctionContents.length;
    }
}
