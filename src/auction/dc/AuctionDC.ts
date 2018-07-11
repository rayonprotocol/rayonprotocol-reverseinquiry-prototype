// model
import Auction from 'auction/model/Auction';

// dc
import ContractDC, { ContractInstance } from 'common/dc/ContractDC';
import UserDC from 'user/dc/UserDC';

enum ContentIndex {
  id = 0,
  title,
  content,
  financeData,
  userName,
  userAddress,
  timeStamp,
}

class AuctionDC {
  private auctionContents: Auction[];

  getAuctionContents() {
    return this.auctionContents === undefined ? [] : this.auctionContents;
  }

  getAuctionContentByIndex(index: number) {
    console.log('call', this.auctionContents[index], index);
    return this.auctionContents[index];
  }

  async getContentList() {
    const instance = ContractDC.getInstance(ContractInstance.AuctionInstance);
    const getContentResult = await instance.getContentList({
      from: ContractDC.getAccount(),
    });
    return this.makeContentList(getContentResult, instance);
  }

  async makeContentList(getContentResult, instance) {
    const contentLength = (await instance.contentLength()).toNumber();
    const titles = getContentResult[ContentIndex.title].split('||');
    const contents = getContentResult[ContentIndex.content].split('||');
    const financeDatas = getContentResult[ContentIndex.financeData].split('||');
    const userName = getContentResult[ContentIndex.userName].split('||');
    const auctionContents: Auction[] = [];
    for (let i = 0; i < contentLength; i++) {
      const newAuctionContent = new Auction();
      newAuctionContent.id = getContentResult[ContentIndex.id][i].toNumber();
      newAuctionContent.title = titles[i];
      newAuctionContent.content = contents[i];
      newAuctionContent.financeData = financeDatas[i].split('%%');
      newAuctionContent.userName = userName[i];
      newAuctionContent.userAddress = getContentResult[ContentIndex.userAddress][i];
      newAuctionContent.timeStamp = getContentResult[ContentIndex.timeStamp][i].toNumber();
      auctionContents.push(newAuctionContent);
    }
    this.auctionContents = auctionContents;
    return this.auctionContents;
  }

  async registerContent(title: string, content: string, tags: string[]) {
    const user = UserDC.getUser();
    if (user.userName === undefined) return false;
    const userAddress = ContractDC.getAccount();
    const instance = ContractDC.getInstance(ContractInstance.AuctionInstance);
    const financeData = tags.join('%%');
    // 가스를 소모하지 않고 유저가 가입되어있는지 확인
    const callResult = await instance.registContent.call(title, content, financeData, user.userName, userAddress, {
      from: userAddress,
    });
    if (!callResult) {
      return false;
    } else {
      // 가입 되어있지않다면 정상적인 트랜잭션을 다시 보냄
      await instance.registContent(title, content, financeData, user.userName, userAddress, {
        from: userAddress,
      });
      return true;
    }
  }
}

export default new AuctionDC();
