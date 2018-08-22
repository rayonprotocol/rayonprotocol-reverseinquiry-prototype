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
        uint insertTime;
    }

    // variables
    ReverseInquiry[] reverseInquiries;

    event LogRegisterReverseInquiry(address userAddress, string userName, string title, string description, string financeData,  uint insertTime);

    function registerReverseInquiry(string _title, string _description, string _financeData, string _userName) public {
        uint currentTime = now;
        reverseInquiries.push(ReverseInquiry(msg.sender, _userName, _title, _description, _financeData, currentTime));
        emit LogRegisterReverseInquiry(msg.sender, _userName, _title, _description, _financeData, currentTime);
    }

    function getReverseInquiry(uint _index) public view returns(uint, address, string, string, string, string, uint) {
        require(_index < reverseInquiries.length);
        ReverseInquiry memory reverseInquiry = reverseInquiries[_index];
        return (
            _index,
            reverseInquiry.userAddress,
            reverseInquiry.userName,
            reverseInquiry.title,
            reverseInquiry.description,
            reverseInquiry.financeData,
            reverseInquiry.insertTime
        );
    }

    function getReverseInquiriesLength() public view returns(uint) {
        return reverseInquiries.length;
    }
}
