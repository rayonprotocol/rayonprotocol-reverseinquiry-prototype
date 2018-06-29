# Rayon Protocol ("Rayon") Reverse Inquiry

This is Rayon's reverse inquiry smart contract prototype based on Ethereum.  Parties to the smart contract are Borrowers and Lenders.

## The Challenge

Currently retail lending transactions proceed without accurate and sufficient information on both borrowers and lenders, resulting in time, money and emotional drain for individuals and significant costs and risk for lenders.

- Signaling Cost of Borrowers
  - Individuals need to provide their personal data to lenders
  - Provided personal data is subject to data leak risks
  - Borrowers also have no clarity on usage of their provided data nor on the transaction process
  - Borrowers need to go through multiple iterations of the application process on a piecemeal basis in order to receive multiple  quotes

- Search Cost of Lenders
  - The financial services industry is one of the top spenders in online advertising
  - 3 out of the Top 5 most expensive Google keywords are related to loans ("loans", "mortgage", "credit")
  - However, financial institutions can only conduct advertising on an unspecified basis in today's online advertising market

## Solution

Transform the transacting method of retail lending.  Enter Rayon reverse inquiries.

Rayon enables the accurate exchange of borrower personal data and lender product data amongst borrowers and lenders, which will allow borrowers to receive loan offers from lenders.  Rayon flips the direction from the current transacting method, whereby borrowers will be able to have loan offers come to them, as opposed to having to apply through available application channels on a piecemeal basis. 

### Rayon Reverse Inquiry Process Flow

해당 레포지토리는 Rayon protocol 역경매의 프로토타입 버전이다.
사용자는 개인 유저인 Personal 과 금융사인 FI(finance institude)로 나뉘며, 역경매가 진행되는 순서는 다음과 같다.

## 개발환경 설정

- 우선 로컬에 reverse inquiry 파일을 클론

```
git clone https://github.com/rayonprotocol/rayonprotocol-reverseinquiry.git
```

- 컴파일 및 배포에 필요한 truffle 을 전역으로 설치

```
npm install -g truffle
```

- 개발용 로컬 노드 사용을 위해 ganache 를 설치

http://truffleframework.com/ganache/

- yarn 을 설치(mac 기준)

https://yarnpkg.com/lang/en/docs/install/#mac-stable

- node_module 설치

```
cd rayonprotocol-reverseinquiry
yarn
```

- ganache 세팅, ganache 실행 후 우측 위의 설정 버튼을 누르고 아래와 같이 값을 설정해준다. 이 값들은 truffle.js 내부에 정의되어있다.

![image](https://user-images.githubusercontent.com/20614643/40952635-f1470cfc-68b6-11e8-9f85-c9b60eb268a7.png)

![image](https://user-images.githubusercontent.com/20614643/40952631-ef11e614-68b6-11e8-9761-d6d0f4312c1e.png)

![image](https://user-images.githubusercontent.com/20614643/40952644-fa9c9c04-68b6-11e8-8156-1928a24c79e7.png)

- 스마트 컨트랙트 배포 및 reverse inquiry 클라이언트 실행

```
# 스마트 컨트랙트 배포
yarn truffle

# reverse inquiry
yarn start
```

## 클라이언트 기능 사용법

### 시작하기

유저는 좌측 상단 가입하기 버튼을 누른다. 이 때 메타마스크와 같은 지갑이 설치/실행 되어 있어야한다.

![image](https://user-images.githubusercontent.com/20614643/40899626-da3ef344-6802-11e8-91ba-b4006f9771d1.png)

### 가입하기

Personal/FI 인지 선택한 후 서비스에서 사용할 닉네임을 입력한다. 이 후 가입하기 버튼을 클릭하고 새로고침하면 가입과 동시에 로그인이 완료된다. 로그인 시 상단의 Navigation bar 의 메뉴가 추가된다.

![image](https://user-images.githubusercontent.com/20614643/40899656-0572ddf0-6803-11e8-8fd1-490a49f974f9.png)

### 금융데이터 등록

우선 개인의 금융데이터를 등록해야한다. 이를 위해 로그인 후 Navigation bar 에 금융데이터 등록을 클릭하면 아래와 같은 리스트가 출력된다. 자신이 제공할 수 있는 데이터들을 입력하고 입력을 누르면, 블록체인이 아닌 로컬에 데이터가 기록된다.

![image](https://user-images.githubusercontent.com/20614643/40899713-442df048-6803-11e8-8a9f-98fca9aa07a1.png)

### 경매 공고 등록(Personal)

경매공고를 클릭하면 현재까지 작성된 글의 목록이 나온다. 경매 공고는 Personal 만 작성이 가능하며 FI 로 접속했을떄는 글쓰기 버튼이 나오지 않는다. 우측 상단 글쓰기 버튼을 클릭하면 아래와 같이 글쓰기 폼이 나온다. 여기서 제목과 내용, 본인이 제공할 수 있는 금융데이터를 선택하여 블록체인에 등록하자.

![image](https://user-images.githubusercontent.com/20614643/40899756-6f4b0d6a-6803-11e8-9c12-d2ab821c30a1.png)

### 경매 공고 확인

블록체인에 등록되기 위해 어느정도의 시간이 필요하다. private 네트워크에서는 그 시간이 짧지만, 실제 메인넷에서 구동될 경우 등록되기 위한 적당한 시간이 필요할 것이다. 블록체인에 경매 공고가 등록이 된다면 경매공고 페이지에서 아래와 같이 내가 등록한 글을 볼 수 있다. 제목을 클릭하면 상세페이지로 넘어간다.

![image](https://user-images.githubusercontent.com/20614643/40899778-8aa3eb40-6803-11e8-92f9-f29033055d14.png)

### 개인 데이터 요청(FI)

이번에는 계정을 바꾸어 FI 로 회원가입/로그인 한 후 먼저 작성한 공고의 상세페이지로 들어가면, 하단에 데이터 요청 버튼이 보인다. 은행이 필요한 데이터들을 선택하고 이를 클릭하면, 작성자에게 데이터 요청이 전송된다.

![image](https://user-images.githubusercontent.com/20614643/40899830-d6522278-6803-11e8-9a3a-9d0bd909592c.png)

### 메세지 함

우측 상당 메세지 함을 클릭하면 메세지 스레드에 대한 이력을 열람할 수 있다. 글 제목 옆의 태그는 최신 메세지에 대한 태그를 나타낸다.

![image](https://user-images.githubusercontent.com/20614643/40899857-faecc6c4-6803-11e8-830c-03648f64dc3c.png)

### 데이터 응답(Personal)

요청 받은 메세지에 응답하기 위해 다시 개인 계정으로 접속 후, 메세지 함에 해당 글을 클릭하여 데이터 전송하기를 누른다.

![image](https://user-images.githubusercontent.com/20614643/40899988-88b11e42-6804-11e8-9d44-7a673bd4a369.png)

### 상품 제안(FI)

전송 받은 데이터를 기반으로 FI 는 상품을 기획한 후 다시 유저에게 전송하게 된다. 따라서 이는 FI 가 수행해야하므로, FI 계정으로 변경 후 메세지 상세에서 상품 제안 전송하기를 클릭한다. 현재는 코드 내에 string 값으로 고정되어있지만, 추후 변경될 예정이다.

![image](https://user-images.githubusercontent.com/20614643/40900239-9ad08c9c-6805-11e8-8253-e096d5706929.png)

### 상품 거절/수락(Personal)

FI 로 부터 전송받은 상품 정보를 가지고 유저는 상품 거절/수락을 진행할 수 있다. 상품 수락시 상품에 가입하는 로직이 뒤따를 것이며, 거절시 FI 는 새로운 상품을 전송하거나 이를 포기할 수 있다.

![image](https://user-images.githubusercontent.com/20614643/40900303-edb70148-6805-11e8-95dc-54098c50b73d.png)

### 완료

![image](https://user-images.githubusercontent.com/20614643/40900354-24629fb8-6806-11e8-8892-2931dbde584f.png)
