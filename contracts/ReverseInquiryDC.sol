pragma solidity ^0.4.22;
import "./libraries/strings.sol";

contract ReverseInquiryDC {
    using strings for *;

    struct ReverseInquiry {
        address userAddress;
        string userName;
        string title;
        string description;
        string financeData;
        uint insertTime;
    }

    ReverseInquiry[] reverseInquiries;

    event LogRegisterReverseInquiry(uint id, address userAddress, string userName, string title, string description, string financeData,  uint insertTime);

    function registerReverseInquiry(string _title, string _description, string _financeData, string _userName) public {
        uint currentTime = now;
        // 클릭시 id를 사용하여 디테일 페이지로 이동하므로 id가 필요함
        uint index = reverseInquiries.push(ReverseInquiry(msg.sender, _userName, _title, _description, _financeData, currentTime)) - 1;
        emit LogRegisterReverseInquiry(index, msg.sender, _userName, _title, _description, _financeData, currentTime);
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
