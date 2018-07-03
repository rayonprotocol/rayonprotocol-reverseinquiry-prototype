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
- Lenders receive and review loan request from Borrower
- Interested Lenders request for additional personal data to Borrower
- Borrower provides requested additional data to Lenders under his/her consent
- Lenders provide final binding terms (loan offers) to Borrower on the basis of received addtional data from Borrower
- Borrower receives and reviews final offers from Lenders
- Borrower ultimately selects / accepts most competitive offer received from Lenders

### Development Environment Settings

- first clone the reverse inquiry file to your local drive

```
git clone https://github.com/rayonprotocol/rayonprotocol-reverseinquiry.git
```

- install truffle used for COM file and publishing

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

- ganache settings, after executing ganache set values as below by clicking on the settings button on the top right. These values are defined in truffle.js

![image](https://user-images.githubusercontent.com/20614643/40952635-f1470cfc-68b6-11e8-9f85-c9b60eb268a7.png)

![image](https://user-images.githubusercontent.com/20614643/40952631-ef11e614-68b6-11e8-9761-d6d0f4312c1e.png)

![image](https://user-images.githubusercontent.com/20614643/40952644-fa9c9c04-68b6-11e8-8156-1928a24c79e7.png)

- publish smart contract and execute reverse inquiry client

```
# publish smart contract
yarn truffle

# reverse inquiry
yarn start
```

### Client Function Manual 

#### Start

User clicks on the sign up button on the top left.  A wallet application such as MetaMask must be installed and running.

![image](https://user-images.githubusercontent.com/20614643/40899626-da3ef344-6802-11e8-91ba-b4006f9771d1.png)

#### Sign Up

Type nickname after selecting "Borrower" or "Lender". After clicking the sign up button and refreshing the page, the sign up and login processes are completed simultaneously. After logging in, the Navigation Bar menu at the top gets added.

![image](https://user-images.githubusercontent.com/20614643/40899656-0572ddf0-6803-11e8-8fd1-490a49f974f9.png)

### Registering Personal Financial Data

First the Borrower must register his/her personal financial data. To do this, the Borrower clicks on the Register Personal Data menu on the Navigation Bar after logging in.  Clicking the  menu provides the following list.  After inputting data for selected fields, such registered data gets recorded on the local drive, not on the blockchain.

![image](https://user-images.githubusercontent.com/20614643/40899713-442df048-6803-11e8-8a9f-98fca9aa07a1.png)

### Publish Loan Request (Borrower)

Clicking on Loan Requests displays the list of loan requests published to date. Only Borrowers can write loan requests and the write button does not appear when logged in as a Lender. Clicking on the write button on the top right displays the loan request write form. Here the Borrower writes the title and content of the loan request as well as selects the personal data fields to make available with the loan request. Completing the write form publishes this loan request data to the blockchain.

![image](https://user-images.githubusercontent.com/20614643/40899756-6f4b0d6a-6803-11e8-9c12-d2ab821c30a1.png)

### Checking / Viewing Published Loan Requests

Publishing data to the blockchain requires time. While this will be short for a private network, publishing data to the actual Rayon mainnet will require some time.  Once a loan request is successfully published, it will appear in the list of the Loan Requests page.  Clicking on the title takes you to the details page.

![image](https://user-images.githubusercontent.com/20614643/40899778-8aa3eb40-6803-11e8-92f9-f29033055d14.png)

### Requesting for Additional Personal Data (Lender)

Let's switch accounts and this time sign up and login as a Lender. Click on the Loan Requests menu and view the details on the recently published loan request.  A Request Data button will be available to Lenders. Clicking on specific data fields which are available for the requesting Borrower sends data requests for the selected data to the Borrower.

![image](https://user-images.githubusercontent.com/20614643/40899830-d6522278-6803-11e8-9a3a-9d0bd909592c.png)

### Mailbox

Clicking on the Mailbox on the upper right displays the user's message thread. Tags next to message titles display new or recent messages.

![image](https://user-images.githubusercontent.com/20614643/40899857-faecc6c4-6803-11e8-830c-03648f64dc3c.png)

### Check Addtional Data Requests and Send Requested Data (Borrower)

In order to respond to the addtional data requests by Lenders, login as a Borrower and check your Mailbox.  View the data request message and click on Send Data.

![image](https://user-images.githubusercontent.com/20614643/40899988-88b11e42-6804-11e8-9d44-7a673bd4a369.png)

### Loan Offer (Lender)

After receiving the requested addtional data from the Borrower, the Lender performs its internal credit assessment procedure to confirm final terms & conditions.  This final loan offer is then sent to the Borrower. Given that this function is performed by Lenders, re-login as a Lender and send this final loan offer to the Borrower from the Lender's Mailbox.  While terms are currently fixed as string values within the code, this will be changed in the future.

![image](https://user-images.githubusercontent.com/20614643/40900239-9ad08c9c-6805-11e8-8253-e096d5706929.png)

### Loan Offer Reject/Accept (Borrower)

Borrowers are able to either reject or accept loan offers received from Lenders. If accepted, loan applicaion logic for the selected offer will follow. If rejected, Lenders can either resend revised offers or give up.

![image](https://user-images.githubusercontent.com/20614643/40900303-edb70148-6805-11e8-95dc-54098c50b73d.png)

### Complete

![image](https://user-images.githubusercontent.com/20614643/40900354-24629fb8-6806-11e8-8892-2931dbde584f.png)
