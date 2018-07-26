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
  - 3 out of the top 5 most expensive Google keywords are related to loans ("loans", "mortgage", "credit")
  - However, financial institutions can only conduct advertising on an unspecified basis in today's online advertising market

## Solution

Transform the transacting method of retail lending.  Enter Rayon reverse inquiries.

Rayon enables the accurate exchange of borrower personal data and lender product data amongst borrowers and lenders, which will allow borrowers to reversely receive loan offers from lenders.  Rayon flips the direction from the current transacting method, whereby borrowers will be able to have loan offers come to them, as opposed to having to apply through available application channels on a piecemeal basis. 

### Rayon Reverse Inquiry Process Flow
- Borrower registers his/her personal data
- Borrower publishes loan request (indication of interest for loan to Lenders)
- Lenders review loan request from Borrower
- Interested Lenders request for additional personal data to Borrower
- Borrower provides requested additional data to Lenders under his/her consent
- Lenders provide final binding terms (loan offers) to Borrower on the basis of received addtional data from Borrower
- Borrower receives and reviews final offers from Lenders
- Borrower ultimately accepts most competitive offer received from Lenders

Kindly note that this is a prototype and as such, certain processes are currently implemented in rudimentary form. Such processes will be updated in accordance with the overall development progress of Rayon Protocol.

### Development Environment Settings

- first clone the reverse inquiry file to your local drive

```
git clone https://github.com/rayonprotocol/rayonprotocol-reverseinquiry.git
```

- install truffle used for COM file and deployment

```
npm install -g truffle
```

- install ganache for use of local development node

http://truffleframework.com/ganache/

- install yarn (for mac)

https://yarnpkg.com/lang/en/docs/install/#mac-stable

- install node_module

```
cd rayonprotocol-reverseinquiry
yarn
```

- after executing ganache, set values as below by clicking on the settings button on the top right. These values are defined in truffle.js

![image](https://user-images.githubusercontent.com/20614643/40952635-f1470cfc-68b6-11e8-9f85-c9b60eb268a7.png)

![image](https://user-images.githubusercontent.com/20614643/40952631-ef11e614-68b6-11e8-9761-d6d0f4312c1e.png)

![image](https://user-images.githubusercontent.com/20614643/40952644-fa9c9c04-68b6-11e8-8156-1928a24c79e7.png)

- deploy smart contract and execute reverse inquiry client

```
# deploy smart contract
yarn truffle

# reverse inquiry
yarn start
```

### Client Function Manual 

#### Start

Click on **Sign Up** to begin.
<p align="center">
<img src="https://user-images.githubusercontent.com/20614643/43250248-dfe29788-90f7-11e8-8707-62e017834bc2.png" width="250px"/>
</p>

#### Create Account

Type user ID after selecting "Borrower" or "Lender" for account type using the dropdown menu. For demonstration purposes of this prototype, first create a Borrower account (we used **"Alice"** as the user ID). Click the **Submit** button and confirm the data publishing transaction on Metamask. Note that this confirmation will take some time. After confirming the transaction on your browser console, refresh the page which will complete the Create Account and login processes simultaneously.  Once logged in, your user ID and available menus for Rayon Borrowers will viewable at the top of the screen.

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250377-312451ea-90f8-11e8-8d95-7f21193393db.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250378-3149edce-90f8-11e8-95ed-1ee852ea902f.png" width="250px"/>
</p>

#### Registering Personal Data (Borrower - "Alice")

First the Borrower must register his/her personal financial data. To do this, the Borrower clicks on the **Register Data** menu at the top of the screen. While there will be multiple methods to gather and input personal data of borrowers either sourced from open APIs or through third party data providers, we have currently implemented our prototype so that Borrowers directly input their personal data. A Borrower can freely input key-value pairs for test purposes (e.g. age-34; income-$40,000; credit score-756). Click the **Add** button to add new personal data fields to input and make sure to click the **Save** button at the bottom once all inputs are complete. Such registered data gets recorded on the local drive, not on the blockchain.

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250449-55805b92-90f8-11e8-882d-6daf6068c458.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250450-55a6d286-90f8-11e8-9e3a-8db407f40c10.png" width="250px"/>
</p>

Kindly note that Rayon will be developed so that no raw data of Rayon borrowers will be stored on Rayon Protocol. Personal borrower data in raw or processed formats will either be stored on users' local devices or on the servers of Rayon borrower DApps. Personal data of Rayon borrowers published on the Rayon blockchain will strictly be limited to data hash values and pseudonymized formats. 

#### Publish Loan Request (Borrower - "Alice")

Clicking on the **Loan Requests** menu on the top of the screen displays the list of loan requests published to date. Only Borrowers can write loan requests and the **New Request** button does not appear when logged in as a Lender. Clicking on the **New Request** button on the right displays the loan request write form. Here the Borrower writes the title and content of the loan request as well as selects the personal data fields to make available with the loan request. Complete the write form by clicking the **Submit** button.  This prompts you to confirm the transaction on Metamask. Confirm on Metamask and wait for the transaction to publish to the blockchain. Transaction confirmation can be checked on your browser console.  Once confirmed, refreshing the page will display the freshly published loan request in the Loan Requests list. In the screenshots below, Borrower ("Alice") created a loan request for a 1 year, $3,000 credit loan and indicated that her age, income and credit score data are available to lenders.


<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250504-77054df4-90f8-11e8-9047-08a6bd91c054.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250505-772c606a-90f8-11e8-8b48-7d8d9054f6bc.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250506-7751c756-90f8-11e8-93fd-fc6f47d23d55.png" width="250px"/>
</p>

#### Check / View Published Loan Requests

Publishing data to the blockchain requires time. While this will be short for a private network, publishing data to the actual Rayon Mainnet will require some time.  Successfully published loan requests will appear in the list of the Loan Requests page and clicking on the title area takes you to the details page of the clicked loan request. Both Borrowers and Lenders have access to the Loan Requests menu and published loan requests. Borrowers will be able to check that their loan requests are correctly and successfully published, while Lenders will be able to view published loan requests posted by Borrowers. Details can be viewed by clicking on the title area of published loan requests.

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250560-9e66b91e-90f8-11e8-8e7a-27133ad796ae.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250561-9e91baa6-90f8-11e8-96b5-fded53bb84a3.png" width="250px"/>
</p>

#### Request for Additional Personal Data (Lender - "BB Bank")

Let's switch accounts and this time sign up and login as a Lender. Be advised that you must first log out of Metamask. Once logged out, click on the **Sign Up** button and this time, select Lender from the dropdown menu and input your User ID. (we used **"BB Bank"** as our user ID) Click the **Submit** button and confirm the transaction on Metamask. Wait for transaction confirmation, which can be checked on your brower console. After transaction confirmation, refresh the page to complete the sign up and login processes. 

<p align="center">
<img src="https://user-images.githubusercontent.com/20614643/43250598-b10b85b8-90f8-11e8-927d-80b671b06cfb.png" width="250px"/>
</p>

Now as a Lender, click on the **Loan Requests** menu and view the details on the recently published loan request by the Borrower ("Alice") by clicking on the title area of the request. A **Request Personal Data** button will be available only to Lenders. Select specific personal data fields to request which are available for the requesting Borrower then click on the **Request Personal Data** button. Confirm the transaction on Metamask to send the data request for the selected data to the Borrower. In the screenshot below, Lender ("BB Bank") requested for 2 (income and credit score) out of the 3 available personal data fields for the Borrower ("Alice").

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250640-cbe28620-90f8-11e8-863d-3093e735bbd6.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250642-cc1061bc-90f8-11e8-99e9-e5389666ece5.png" width="250px"/>
</p>

#### Mailbox

Clicking on the **Mailbox** menu on the top of the screen displays the logged in user's message thread. Tags (bold & colored) are created below message titles which display the current status and transaction stage of the message.  As a Lender, you will be able to view your recently published additional data request message sent to the Borrower ("Alice") who published the loan request. Clicking on the title area of the message will display its details. Note that a "Requested Data" tag is now displayed below the message title.

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43251349-9ec40770-90fa-11e8-9f29-c95a4a5c1b28.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250683-e46691a0-90f8-11e8-9d94-d146daae14c5.png" width="250px"/>
</p>

#### Check Addtional Data Requests and Send Requested Data (Borrower - "Alice")

In order to respond to the addtional data request by Lender "BB Bank", first log out of Metamask and re-login as the Borrower "Alice" then check your **Mailbox**. View the data request message sent from Lender "BB Bank" in your Mailbox and click on the **Send Data** button to send the requested additional data to Lender "BB Bank". You also need to confirm the transaction on Metamask. Once successfully sent, Borrower "Alice" can confirm her message thread with Lender "BB Bank" by clicking on the **Mailbox**. Current status will be updated and displayed as a tag below message titles (tag is now updated as "Sent Data") and details can be viewed by clicking on the title area of the message. 

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43251277-78fc216c-90fa-11e8-860f-17e64499d5a3.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250734-fd8949ca-90f8-11e8-8010-557afc752af4.png" width="250px"/>
</p>

Please note that while we have implemented the direct sending of borrower data to lenders at this stage of our prototype, we plan to utilize a randomly generated PKI encryption system for the actual sending of borrower data to lenders through IPFS or cloud storage.

#### Loan Offer (Lender - "BB Bank")

Log out of Metamask and re-login as Lender "BB Bank". After checking & receiving the requested addtional data from the Borrower "Alice" in its **Mailbox**, Lender "BB Bank" runs its internal credit assessment process to formulate its final loan terms & conditions. Clicking on the **Send Offer** displays a modal dialogue window where you can input your proposed loan amount, annual interest rate and maturity. Click the **Submit** button and confirm the transaction on Metamask. In the screenshot below, Lender "BB Bank" provided an offer for a 1 year, $3,000 loan at 5.8% interest.

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250770-189b975e-90f9-11e8-934b-9d321819e402.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250771-18c6b628-90f9-11e8-8bdc-e9de9a30c4ce.png" width="250px"/>
</p>

You can confirm that your loan offer was successfully sent to the Borrower by clicking on your **Mailbox**.

<p align="center">
<img src="https://user-images.githubusercontent.com/20614643/43250845-42c12efe-90f9-11e8-992c-cf2d6dab05b9.png" width="250px"/>
</p>


#### Participation by Second Lender (Lender - "CC Bank")

Please note that this entire lender-side process can be repeated as another Lender. Multiple lenders are expected to participate in the Rayon ecosystem and as a result, Rayon borrowers will be able to receive multiple loan offers. Our prototype allows for the creation of multiple Borrower and Lender accounts for testing purposes. As such, create a new account as another Lender (this time we used "Lender CC Bank" as the user ID. Also note that you will need a new / different Metamask address to create a new lender account from the one used to create the "BB Bank" ID), click on the **Loan Requests** menu, view the loan request details of the single loan request currently published by clicking on the title area and request for additional personal data of the borrower who published the loan request ("Alice"). For comparison purposes, request for different personal data fields from the earlier request already sent by Lender "BB Bank". In the screenshot below, Lender "CC Bank" didn't request for the Borrower's credit score as Lender "BB Bank" did. Instead, Lender "CC Bank" requested for the Borrower's age and income data.

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250871-51fb6f9c-90f9-11e8-9709-d22b7f0c9b49.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250872-522154f0-90f9-11e8-8332-feee68488cec.png" width="250px"/>
</p>

#### Check Additional Data Request and Send Requested Data (Borrower - "Alice")

In order to respond to the addtional data request by Lender "CC Bank", log out of Metamask, re-login as Borrower "Alice" then check your **Mailbox**. View the data request message sent from Lender "CC Bank" in your Mailbox and click on the **Send Data** button to send the requested additional data to Lender "CC Bank". You also need to confirm the transaction on Metamask. Once successfully sent, Borrower  "Alice" can confirm her message thread with Lender "CC Bank" by clicking on the **Mailbox**. Current status will be updated and displayed as message tags and details can be viewed by clicking on the title area. 


<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250901-673e3db2-90f9-11e8-9895-803cdee6380d.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250902-67655fdc-90f9-11e8-9ff7-1fd98429e9d3.png" width="250px"/>
</p>

#### Loan Offer (Lender - "CC Bank")

Log out of Metamask and re-login as Lender "CC Bank". After receiving & checking the requested addtional data from the Borrower "Alice" in its **Mailbox**, Lender "CC Bank" performs its internal credit assessment procedure to formulate & confirm final loan terms & conditions. This final loan offer can be sent to the Borrower "Alice" by clicking on the **Send Offer** button. A modal dialogue window will pop up where you can input your proposed loan amount, annual interest rate and maturity. Click the **Submit** button and confirm the transaction on Metamask. In the screenshot below, Lender "CC Bank" sent a 1 year, $4,000 loan offer at 6.1% interest. 

<p align="center">
 <img src="https://user-images.githubusercontent.com/20614643/43250965-98b2d5ce-90f9-11e8-988b-133d581cf469.png" width="250px"/>
 <img src="https://user-images.githubusercontent.com/20614643/43250966-98d51de6-90f9-11e8-9add-22b42f601dd5.png" width="250px"/>
</p>

#### Loan Offer Reject/Accept (Borrower - "Alice")

Borrowers are able to view all loan offers received from Lenders in their **Mailbox**.

Borrowers then either reject or accept loan offers received. If the Borrower clicks the **Reject** button for a received offer, the rejected lender will be notified accordingly and the rejection will also be published to the blockchain which needs to be confirmed on Metamask. We rejected the offer from "CC Bank".

If the Borrower clicks on the **Accept** button for a received offer, the transaction needs to be published to the blockchain, so confirm the transaction on Metamask. Once confirmed, the Borrower will see a brief message from the Lender as well as a link which will take the Borrower to the online product registration screen to sign up for the loan under the terms as provided by the Lender. We accepted the offer from "BB Bank".

<p align="center">
<img src="https://user-images.githubusercontent.com/20614643/43251057-dd22a478-90f9-11e8-9969-0945208cf3b5.png" width="250px"/>
<img src="https://user-images.githubusercontent.com/20614643/43251058-dd4dd4c2-90f9-11e8-9833-1c698cbd04c9.png" width="250px"/>
</p>

<p align="center">
<img src="https://user-images.githubusercontent.com/20614643/43251059-dd71056e-90f9-11e8-84c0-4a99900293a4.png" width="250px"/>
<img src="https://user-images.githubusercontent.com/20614643/43251060-dd968910-90f9-11e8-82b5-ceeb0a2548e8.png" width="250px"/>
</p>


