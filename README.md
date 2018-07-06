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

User clicks on the **Create Account** button on the top right-hand corner. A wallet application such as MetaMask must be installed and running.

![2018-07-06 4 21 30](https://user-images.githubusercontent.com/39897681/42370625-35c4f6c4-8148-11e8-80b0-1e201d4b01dd.png)

#### Create Account

Type user ID after selecting "Borrower" or "Lender" for account type. For demonstration purposes of this prototype, first create a Borrower account. Click the **Submit** button and confirm the data publishing transaction on Metamask. Note that this confirmation will take some time. After confirming the transaction on your browser console, refresh the page which will complete the Create Account and login processes simultaneously.  Once logged in, the Navigation Bar menu will be added and viewable at the top of the screen.

![2018-07-06 4 22 46](https://user-images.githubusercontent.com/39897681/42372518-5a843a60-814d-11e8-991e-9357a7008a7b.png)
![2018-07-06 4 23 04](https://user-images.githubusercontent.com/39897681/42372577-8d359666-814d-11e8-8bcb-2f11a5568136.png)

### Registering Personal Data

First the Borrower must register his/her personal financial data. To do this, the Borrower clicks on the **Register Data** menu on the right-hand side of the Navigation Bar. Clicking the menu launches the KYC screen. Borrower must successfully complete KYC in order to register his/her personal data. Given this is a prototype, we have implemented a simple KYC procedure where the Borrower simply types "agree", clicks the **Validate** button and then submits the transaction on Metamask in order to successfully perform KYC validation.  Once you submit on Metamask, the home screen will load. Wait for transaction confirmation and once confirmed from your browser console, click on the **Register Data** menu again which will load the personal data input screen. 

While there will be multiple methods to gather and input personal data of borrowers either sourced from open APIs or through third party data providers, we have currently implemented our prototype so that Borrowers directly input their personal data. A Borrower can freely input key-value pairs for test purposes (e.g. income-$50,000; age-26; gender-male; existing debt-$10,000). Click the **Add** button to add new personal data fields to input and make sure to click the **Save** button at the bottom once all inputs are complete. Such registered data gets recorded on the local drive, not on the blockchain.

Kindly note that Rayon will be developed so that no raw data of Rayon borrowers will be stored on Rayon Protocol. Personal borrower data in raw or processed formats will either be stored on users' local devices or on the servers of Rayon borrower DApps. Personal data of Rayon borrowers published on the Rayon blockchain will strictly be limited to data hash values and pseudonymized formats. 

![image](https://user-images.githubusercontent.com/20614643/40899713-442df048-6803-11e8-8a9f-98fca9aa07a1.png)

### Publish Loan Request (Borrower)

Clicking on the **Loan Requests** menu on the Navigation Bar displays the list of loan requests published to date. Only Borrowers can write loan requests and the **New Request** button does not appear when logged in as a Lender. Clicking on the **New Request** button on the right displays the loan request write form. Here the Borrower writes the title and content of the loan request as well as selects the personal data fields to make available with the loan request. Complete the write form by clicking the **Submit** button.  This prompts you to confirm the transaction on Metamask. Confirm on Metamask and wait for the transaction to publish to the blockchain. Transaction confirmation can be checked on your browser console.  Once confirmed, refreshing the page will display the freshly published loan request in the Loan Requests list.

![image](https://user-images.githubusercontent.com/20614643/40899756-6f4b0d6a-6803-11e8-9c12-d2ab821c30a1.png)

### Check / View Published Loan Requests

Publishing data to the blockchain requires time. While this will be short for a private network, publishing data to the actual Rayon MainNet will require some time.  Successfully published loan requests will appear in the list of the Loan Requests page and clicking on the title takes you to the details page of the clicked loan request. Both Borrowers and Lenders have access to the Loan Requests menu and the published loan requests list and can view details. Borrowers will be able to check that their loan requests are correctly and successfully published. Lenders will be able to view published loan requets by Borrowers.

![image](https://user-images.githubusercontent.com/20614643/40899778-8aa3eb40-6803-11e8-92f9-f29033055d14.png)

### Request for Additional Personal Data (Lender)

Let's switch accounts and this time sign up and login as a Lender. Be advised that you must first logout of Metamask. Once logged out, click on the **Create Account** menu on the top right-hand corner. This time, select Lender and input your User ID. Click the **Submit** button and confirm the transaction on Metamask. Wait for transaction confirmation, which can be checked on your brower console. After transaction confirmation, refresh the page to complete the sign up and login processes.

Now as a Lender, click on the **Loan Requests** menu and view the details on the recently published loan request by the Borrower by clicking on the title. A **Request Personal Data** button will be available only to Lenders. Select specific data fields which are available for the requesting Borrower then click on the **Request Personal Data** button. Confirm the transaction on Metamask to send the data request for the selected data to the Borrower.

Please note that this entire process can be repeated as another Lender. Multiple lenders are expected to participate in the Rayon ecosystem and as a result, Rayon borrowers will be able to receive multiple loan offers. Our prototype allows for the creation of multiple Borrower and Lender accounts for testing purposes. As such, create a new account as another Lender, click on the **Loan Requests** menu, view the loan request details of the single loan request currently published by clicking on the title and request for additional personal data of the borrower who published the loan request. For comparison purposes, request for different personal data fields from the earlier request already sent from the first Lender account.

![image](https://user-images.githubusercontent.com/20614643/40899830-d6522278-6803-11e8-9a3a-9d0bd909592c.png)

### Mailbox

Clicking on the **Mailbox** menu on the right side of the Navigation Bar displays the logged in user's message thread. Tags next to message titles display the current status and transaction stage of the message.  As a Lender, you will be able to view your recently published additional data request message sent to the Borrower who published the loan request.

![image](https://user-images.githubusercontent.com/20614643/40899857-faecc6c4-6803-11e8-830c-03648f64dc3c.png)

### Check Addtional Data Requests and Send Requested Data (Borrower)

In order to respond to the addtional data requests by Lenders, first logout of Metamask and re-login as a Borrower then check your **Mailbox**. View the data request messages sent from the two lenders in your Mailbox and click on the **Send Data** button to send the requested additional data to the Lender. You also need to confirm the transaction on Metamask.

Please note that while we have implemented the direct sending of borrower data for this prototype, we will utilize a randomly generated PKI encryption system for the actual transmitting of borrower data through IPFS or cloud storage.

![image](https://user-images.githubusercontent.com/20614643/40899988-88b11e42-6804-11e8-9d44-7a673bd4a369.png)

### Loan Offer (Lender)

After receiving the requested addtional data from the Borrower, the Lender performs its internal credit assessment procedure to confirm final terms & conditions.  This final loan offer is then sent to the Borrower. Given that these functions are performed by Lenders, first log out of Metamask and re-login as a Lender. Check the received additional personal data sent by the Borrower in your **Mailbox**. Based on this data, formulate your final binding offer as a result of your internal credit assessment system and click on the **Send Offer** button. A modal dialogue window will pop up where you can input your proposed loan amount, annual interest rate and maturity. Click the **Submit** button and confirm the transaction on Metamask. Repeat this process for your second Lender account.

![image](https://user-images.githubusercontent.com/20614643/40900239-9ad08c9c-6805-11e8-8253-e096d5706929.png)

### Loan Offer Reject/Accept (Borrower)

Borrowers are able to either reject or accept loan offers received from Lenders. If the Borrower clicks on the **Accept** button, the transaction needs to be published to the blockchain, so confirm the transaction on Metamask. Once confirmed, the Borrower will see a brief message from the Lender as well as a link which will take the Borrower to the online product registration screen to sign up for the loan under the terms as provided by the Lender.

If the Borrower clicks the **Reject** button, the rejected lender will be notified accordingly and the rejection will also be published to the blockchain which needs to be confirmed on Metamask.

![image](https://user-images.githubusercontent.com/20614643/40900303-edb70148-6805-11e8-95dc-54098c50b73d.png)

### Offer Result Notification (Lenders)

Offer acceptance or rejection results as selected by the Borrower will be notified to Lenders and can be checked in their respective Mailboxes.

![image](https://user-images.githubusercontent.com/20614643/40900354-24629fb8-6806-11e8-8892-2931dbde584f.png)
