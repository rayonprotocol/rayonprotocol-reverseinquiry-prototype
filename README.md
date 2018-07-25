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

![-1_resized](https://user-images.githubusercontent.com/39897681/43182751-a9ffe9ca-901d-11e8-89fe-dd4449b15b9d.png)

#### Create Account

Type user ID after selecting "Borrower" or "Lender" for account type using the dropdown menu. For demonstration purposes of this prototype, first create a Borrower account (we used **"Alice"** as the user ID). Click the **Submit** button and confirm the data publishing transaction on Metamask. Note that this confirmation will take some time. After confirming the transaction on your browser console, refresh the page which will complete the Create Account and login processes simultaneously.  Once logged in, your user ID and available menus for Rayon Borrowers will viewable at the top of the screen.

![2 3_resized](https://user-images.githubusercontent.com/39897681/43182918-3e463c92-901e-11e8-890a-3b15b2916b51.png)

#### Registering Personal Data (Borrower - "Alice")

First the Borrower must register his/her personal financial data. To do this, the Borrower clicks on the **Register Data** menu at the top of the screen. While there will be multiple methods to gather and input personal data of borrowers either sourced from open APIs or through third party data providers, we have currently implemented our prototype so that Borrowers directly input their personal data. A Borrower can freely input key-value pairs for test purposes (e.g. age-34; income-$40,000; credit score-756). Click the **Add** button to add new personal data fields to input and make sure to click the **Save** button at the bottom once all inputs are complete. Such registered data gets recorded on the local drive, not on the blockchain.

![-4](/450x0//https://user-images.githubusercontent.com/39897681/43128192-4860ec20-8f6c-11e8-865c-b344d8d2137b.png)

![-5](https://user-images.githubusercontent.com/39897681/43128199-4ffccf58-8f6c-11e8-9a83-32b87476abf2.png)

Kindly note that Rayon will be developed so that no raw data of Rayon borrowers will be stored on Rayon Protocol. Personal borrower data in raw or processed formats will either be stored on users' local devices or on the servers of Rayon borrower DApps. Personal data of Rayon borrowers published on the Rayon blockchain will strictly be limited to data hash values and pseudonymized formats. 

#### Publish Loan Request (Borrower - "Alice")

Clicking on the **Loan Requests** menu on the top of the screen displays the list of loan requests published to date. Only Borrowers can write loan requests and the **New Request** button does not appear when logged in as a Lender. Clicking on the **New Request** button on the right displays the loan request write form. Here the Borrower writes the title and content of the loan request as well as selects the personal data fields to make available with the loan request. Complete the write form by clicking the **Submit** button.  This prompts you to confirm the transaction on Metamask. Confirm on Metamask and wait for the transaction to publish to the blockchain. Transaction confirmation can be checked on your browser console.  Once confirmed, refreshing the page will display the freshly published loan request in the Loan Requests list. In the screenshots below, Borrower ("Alice") created a loan request for a 1 year, $3,000 credit loan and indicated that her age, income and credit score data are available to lenders.

![-6](https://user-images.githubusercontent.com/39897681/43130066-bfccb2e0-8f70-11e8-85da-81ae7f2df80c.png)

![-7](https://user-images.githubusercontent.com/39897681/43130122-e70bafb4-8f70-11e8-95dc-96a36af8f34e.png)

![-8](https://user-images.githubusercontent.com/39897681/43130324-6cfc0312-8f71-11e8-9223-ad936720c28f.png)

#### Check / View Published Loan Requests

Publishing data to the blockchain requires time. While this will be short for a private network, publishing data to the actual Rayon Mainnet will require some time.  Successfully published loan requests will appear in the list of the Loan Requests page and clicking on the title area takes you to the details page of the clicked loan request. Both Borrowers and Lenders have access to the Loan Requests menu and published loan requests. Borrowers will be able to check that their loan requests are correctly and successfully published, while Lenders will be able to view published loan requests posted by Borrowers. Details can be viewed by clicking on the title area of published loan requests.

![-9](https://user-images.githubusercontent.com/39897681/43130364-82bc8f82-8f71-11e8-8b89-9689a3c6cde1.png)

![-10](https://user-images.githubusercontent.com/39897681/43130379-8b9f41bc-8f71-11e8-8f29-49f04a29637d.png)

#### Request for Additional Personal Data (Lender - "BB Bank")

Let's switch accounts and this time sign up and login as a Lender. Be advised that you must first log out of Metamask. Once logged out, click on the **Sign Up** button and this time, select Lender from the dropdown menu and input your User ID. (we used **"BB Bank"** as our user ID) Click the **Submit** button and confirm the transaction on Metamask. Wait for transaction confirmation, which can be checked on your brower console. After transaction confirmation, refresh the page to complete the sign up and login processes. 

![-11](https://user-images.githubusercontent.com/39897681/43131137-441ab11c-8f73-11e8-8c94-5ea37825ae76.png)

Now as a Lender, click on the **Loan Requests** menu and view the details on the recently published loan request by the Borrower ("Alice") by clicking on the title area of the request. A **Request Personal Data** button will be available only to Lenders. Select specific personal data fields to request which are available for the requesting Borrower then click on the **Request Personal Data** button. Confirm the transaction on Metamask to send the data request for the selected data to the Borrower. In the screenshot below, Lender ("BB Bank") requested for 2 (income and credit score) out of the 3 available personal data fields for the Borrower ("Alice").

![-12](https://user-images.githubusercontent.com/39897681/43131364-d11f3420-8f73-11e8-8c00-257b491827ee.png)

![-13](https://user-images.githubusercontent.com/39897681/43131382-d9bb0a46-8f73-11e8-9a53-fcad59f69b50.png)

#### Mailbox

Clicking on the **Mailbox** menu on the top of the screen displays the logged in user's message thread. Tags (bold & colored) are created below message titles which display the current status and transaction stage of the message.  As a Lender, you will be able to view your recently published additional data request message sent to the Borrower ("Alice") who published the loan request. Clicking on the title area of the message will display its details. Note that a "Requested Data" tag is now displayed below the message title.

![-14](https://user-images.githubusercontent.com/39897681/43131623-6f26eec4-8f74-11e8-8aac-6a84291a65dd.png)

![-15](https://user-images.githubusercontent.com/39897681/43131646-7961c684-8f74-11e8-9d46-464ac4eb76a8.png)

#### Check Addtional Data Requests and Send Requested Data (Borrower - "Alice")

In order to respond to the addtional data request by Lender "BB Bank", first log out of Metamask and re-login as the Borrower "Alice" then check your **Mailbox**. View the data request message sent from Lender "BB Bank" in your Mailbox and click on the **Send Data** button to send the requested additional data to Lender "BB Bank". You also need to confirm the transaction on Metamask. Once successfully sent, Borrower "Alice" can confirm her message thread with Lender "BB Bank" by clicking on the **Mailbox**. Current status will be updated and displayed as a tag below message titles (tag is now updated as "Sent Data") and details can be viewed by clicking on the title area of the message. 

![-16](https://user-images.githubusercontent.com/39897681/43174723-97a19a2a-8ff6-11e8-923d-39ed744a87ff.png)

![-17](https://user-images.githubusercontent.com/39897681/43174729-a0e65f4e-8ff6-11e8-890d-4c66c0007cba.png)

Please note that while we have implemented the direct sending of borrower data to lenders at this stage of our prototype, we plan to utilize a randomly generated PKI encryption system for the actual sending of borrower data to lenders through IPFS or cloud storage.

#### Loan Offer (Lender - "BB Bank")

Log out of Metamask and re-login as Lender "BB Bank". After checking & receiving the requested addtional data from the Borrower "Alice" in its **Mailbox**, Lender "BB Bank" runs its internal credit assessment process to formulate its final loan terms & conditions. Clicking on the **Send Offer** displays a modal dialogue window where you can input your proposed loan amount, annual interest rate and maturity. Click the **Submit** button and confirm the transaction on Metamask. In the screenshot below, Lender "BB Bank" provided an offer for a 1 year, $3,000 loan at 5.8% interest.

![-18](https://user-images.githubusercontent.com/39897681/43174844-3686aacc-8ff7-11e8-8f20-df4873ba5b30.png)

![-19](https://user-images.githubusercontent.com/39897681/43174859-4970c50a-8ff7-11e8-8452-a1fe6ef01c81.png)

You can confirm that your loan offer was successfully sent to the Borrower by clicking on your **Mailbox**.

![-20](https://user-images.githubusercontent.com/39897681/43174877-61ee0aa2-8ff7-11e8-9724-40561124da02.png)

#### Participation by Second Lender (Lender - "CC Bank")

Please note that this entire lender-side process can be repeated as another Lender. Multiple lenders are expected to participate in the Rayon ecosystem and as a result, Rayon borrowers will be able to receive multiple loan offers. Our prototype allows for the creation of multiple Borrower and Lender accounts for testing purposes. As such, create a new account as another Lender (this time we used "Lender CC Bank" as the user ID. Also note that you will need a new / different Metamask address to create a new lender account from the one used to create the "BB Bank" ID), click on the **Loan Requests** menu, view the loan request details of the single loan request currently published by clicking on the title area and request for additional personal data of the borrower who published the loan request ("Alice"). For comparison purposes, request for different personal data fields from the earlier request already sent by Lender "BB Bank". In the screenshot below, Lender "CC Bank" didn't request for the Borrower's credit score as Lender "BB Bank" did. Instead, Lender "CC Bank" requested for the Borrower's age and income data.

![-1](https://user-images.githubusercontent.com/39897681/43174952-ae993b1a-8ff7-11e8-9aae-fbd0f74006e9.png)

![-2](https://user-images.githubusercontent.com/39897681/43174964-bbfee1f6-8ff7-11e8-929d-8675c260801c.png)

#### Check Additional Data Request and Send Requested Data (Borrower - "Alice")

In order to respond to the addtional data request by Lender "CC Bank", log out of Metamask, re-login as Borrower "Alice" then check your **Mailbox**. View the data request message sent from Lender "CC Bank" in your Mailbox and click on the **Send Data** button to send the requested additional data to Lender "CC Bank". You also need to confirm the transaction on Metamask. Once successfully sent, Borrower  "Alice" can confirm her message thread with Lender "CC Bank" by clicking on the **Mailbox**. Current status will be updated and displayed as message tags and details can be viewed by clicking on the title area. 

![-3](https://user-images.githubusercontent.com/39897681/43175097-79424456-8ff8-11e8-9389-2df712eeaca9.png)

![-4](https://user-images.githubusercontent.com/39897681/43175122-937e3320-8ff8-11e8-8f3d-808117574e7d.png)

#### Loan Offer (Lender - "CC Bank")

Log out of Metamask and re-login as Lender "CC Bank". After receiving & checking the requested addtional data from the Borrower "Alice" in its **Mailbox**, Lender "CC Bank" performs its internal credit assessment procedure to formulate & confirm final loan terms & conditions. This final loan offer can be sent to the Borrower "Alice" by clicking on the **Send Offer** button. A modal dialogue window will pop up where you can input your proposed loan amount, annual interest rate and maturity. Click the **Submit** button and confirm the transaction on Metamask. In the screenshot below, Lender "CC Bank" sent a 1 year, $4,000 loan offer at 6.1% interest. 

![image](https://user-images.githubusercontent.com/39897681/43181375-bb1f2870-9017-11e8-8251-551f2c915145.png)

![image](https://user-images.githubusercontent.com/39897681/43181451-33e95f28-9018-11e8-9cc3-1910e5d0139f.png)

#### Loan Offer Reject/Accept (Borrower - "Alice")

Borrowers are able to view all loan offers received from Lenders in their **Mailbox**.

Borrowers then either reject or accept loan offers received. If the Borrower clicks the **Reject** button for a received offer, the rejected lender will be notified accordingly and the rejection will also be published to the blockchain which needs to be confirmed on Metamask. We rejected the offer from Lender2.

![2018-07-06 4 49 59](https://user-images.githubusercontent.com/39897681/42384777-ddf7d488-8175-11e8-9499-d11893256e43.png)

If the Borrower clicks on the **Accept** button for a received offer, the transaction needs to be published to the blockchain, so confirm the transaction on Metamask. Once confirmed, the Borrower will see a brief message from the Lender as well as a link which will take the Borrower to the online product registration screen to sign up for the loan under the terms as provided by the Lender. We accepted the offer from Lender1.

![2018-07-06 4 50 33](https://user-images.githubusercontent.com/39897681/42384866-261ef34a-8176-11e8-8cba-af17ab83af10.png)


