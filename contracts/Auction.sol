pragma solidity ^0.4.22;
import "./libraries/strings.sol";

contract Auction {
    using strings for *;

    // structs
    struct Content {
        string title;
        string content;
        string financeData;
        string userName;
        address userAddress;
        uint timeStamp;
    }

    // variables
    uint public contentLength = 0;
    mapping (uint => Content) public contentList;

    // events
    event LogRegistContent(uint id, string title, string content, string financeData, string userName, address userAddress, uint timeStamp);

    function registContent(
        string _title,
        string _content,
        string _financeData,
        string _userName,
        address _userAddress
    ) public returns(bool) {
        contentList[contentLength].title = _title;
        contentList[contentLength].content = _content;
        contentList[contentLength].financeData = _financeData;
        contentList[contentLength].userName = _userName;
        contentList[contentLength].userAddress = _userAddress;
        contentList[contentLength].timeStamp = now;
        emit LogRegistContent(contentLength, _title, _content, _financeData, _userName, _userAddress, contentList[contentLength].timeStamp);
        contentLength++;
        return true;
    }

    function getContentList() public view returns(
        uint[],
        string,
        string,
        string,
        string,
        address[],
        uint[]
    ) {
        uint[] memory idList = new uint[](contentLength);
        strings.slice[] memory titles = new strings.slice[](contentLength);
        strings.slice[] memory contents = new strings.slice[](contentLength);
        strings.slice[] memory userNames= new strings.slice[](contentLength);
        strings.slice[] memory financeDatas= new strings.slice[](contentLength);
        address[] memory userAddress= new address[](contentLength);
        uint[] memory timeStamp= new uint[](contentLength);

        for(uint i = 0; i < contentLength; i++) {
            idList[i] = i;
            titles[i] = contentList[i].title.toSlice();
            contents[i] = contentList[i].content.toSlice();
            financeDatas[i] = contentList[i].financeData.toSlice();
            userNames[i] = contentList[i].userName.toSlice();
            userAddress[i] = contentList[i].userAddress;
            timeStamp[i] = contentList[i].timeStamp;
        }

        return (
            idList,
            "||".toSlice().join(titles),
            "||".toSlice().join(contents),
            "||".toSlice().join(financeDatas),
            "||".toSlice().join(userNames),
            userAddress,
            timeStamp);
    }
}
