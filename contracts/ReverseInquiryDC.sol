pragma solidity ^0.4.22;
import "./libraries/strings.sol";

contract ReverseInquiryDC {
    using strings for *;

    // structs
    struct ReverseInquiry {
        address userAddress;
        string userName;
        string title;
        string description;
        string financeData;  // TODO: string[] , financeDataItems
        uint insertTime;  // insertTime
    }

    // variables
    ReverseInquiry[] reverseInquiries;

    // events  TODO: LogRegisterReverseInquiry  content --> description  finace
    event LogRegisterReverseInquiry(address userAddress, string userName, string title, string description, string financeData,  uint insertTime);

    function registerReverseInquiry(string _title, string _description, string _financeData, string _userName) public {
        uint currentTime = now;
        reverseInquiries.push(ReverseInquiry(msg.sender, _userName, _title, _description, _financeData, currentTime));
        emit LogRegisterReverseInquiry(msg.sender, _userName, _title, _description, _financeData, currentTime);
    }

    function getReverseInquiry(uint contentIndex) public view returns(string, string, string, string, address, uint) {
        require(contentIndex < reverseInquiries.length);
        ReverseInquiry memory reverseInquiry = reverseInquiries[contentIndex];
        return (
            reverseInquiry.title,
            reverseInquiry.description,
            reverseInquiry.financeData,
            reverseInquiry.userName,
            reverseInquiry.userAddress,
            reverseInquiry.insertTime
        );
    }

    function getReverseInquiriesLength() public view returns(uint) {
        return reverseInquiries.length;
    }
}
