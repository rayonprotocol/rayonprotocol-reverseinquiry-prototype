# Rayon protocal reverse auction

This is RayonProtocol's Prototype reverse auction based on Ethereum.

## The challenge

Today, the process of making a loan transaction goes unnoticed, costing individuals time, money, and emotion, and financial institutions pay high costs to the middle class for customer acquisition and customer information.

## Problem

* Existing Broker Based Transaction Structure

  * A sales incentive structure that recommends high-paid products, not good for individuals
  * Financial proposal details that are not transparent to individuals
  * A non-reliable subscription process in which a broker or salesperson can withdraw the performance of a product at any time in a non-facing situation

* Existing search-based trading structure
  * Inconveniency of having to repeat the same product application process
  * Search results that do not take personal financial conditions into account at all
  * High advertising costs that are eventually passed on to individuals

## solution

### Overview

Within the Rayon protocol ecosystem, all personal information is processed with individual consent.
To arrange financial transactions within the ecosystem, Rayon Protocol consists of three key components :

1.  Data Collection Phase

    * Collect and process data in accordance with predefined data schemas (DB)
    * The collected personal information is encrypted and stored on a user local device or IPFS network.
    * FPDB allows users to build up personal information in the form of financial transactions

2.  Data Processing Phase

    * Users can receive various data processing and processing services provided by Rayon Protocol for personal information stored in DB(eg. Alternative credit rating, internal financial information health measurement, analysis of internal financial consumption patterns, etc.)

3.  The financial transaction Phase

    * Ensure the authenticity and probability of transactions through deposits and reputation systems
    * Provide smart contract that enables you to close financial transactions by specifying key conditions for each financial product
    * Provide search function to ecosystem participants to help them find the best trading partner

## Rayon protocol reverse auction prototype

해당 레포지토리는 Rayon protocol 역경매의 프로토타입 버전이다.
사용자는 개인 유저인 Personal 과 금융사인 FI(finance institude)로 나뉘며, 역경매가 진행되는 순서는 다음과 같다.

### 시작하기

유저는 좌측 상단 가입하기 버튼을 누른다. 이 때 메타마스크와 같은 지갑이 설치/실행 되어 있어야한다.

![image](https://user-images.githubusercontent.com/20614643/40763733-e02c5b7c-64e0-11e8-91e2-1a7454d2943c.png)

### 가입하기

Personal/FI 인지 선택한 후 서비스에서 사용할 닉네임을 입력한다. 이 후 가입하기 버튼을 클릭하고 새로고침하면 가입과 동시에 로그인이 완료된다. 로그인 시 상단의 Navigation bar 의 메뉴가 추가된다.

![image](https://user-images.githubusercontent.com/20614643/40763281-6a63543c-64df-11e8-9c59-502bee46cfe7.png)

### 금융데이터 등록

우선 개인의 금융데이터를 등록해야한다. 이를 위해 로그인 후 Navigation bar 에 금융데이터 등록을 클릭하면 아래와 같은 리스트가 출력된다. 자신이 제공할 수 있는 데이터들을 입력하고 입력을 누르면, 블록체인이 아닌 로컬에 데이터가 기록된다.

![image](https://user-images.githubusercontent.com/20614643/40817138-ad600792-658b-11e8-851f-db5d04b2d44d.png)

### 경매 공고 등록

경매공고를 클릭하면 현재까지 작성된 글의 목록이 나온다. 경매 공고는 Personal 만 작성이 가능하며 FI 로 접속했을떄는 글쓰기 버튼이 나오지 않는다. 우측 상단 글쓰기 버튼을 클릭하면 아래와 같이 글쓰기 폼이 나온다. 여기서 제목과 내용, 본인이 제공할 수 있는 금융데이터를 선택하여 블록체인에 등록하자.

![image](https://user-images.githubusercontent.com/20614643/40817175-f55cedf8-658b-11e8-97d8-e820de6164a7.png)

### 경매 공고 확인

블록체인에 등록되기 위해 어느정도의 시간이 필요하다. private 네트워크에서는 그 시간이 짧지만, 실제 메인넷에서 구동될 경우 등록되기 위한 적당한 시간이 필요할 것이다. 블록체인에 경매 공고가 등록이 된다면 경매공고 페이지에서 아래와 같이 내가 등록한 글을 볼 수 있다. 제목을 클릭하면 상세페이지로 넘어간다.

![image](https://user-images.githubusercontent.com/20614643/40817225-3e25a606-658c-11e8-924b-8d46759d0d2e.png)
![image](https://user-images.githubusercontent.com/20614643/40817226-407cd4ce-658c-11e8-8adb-264d1e8359a3.png)
