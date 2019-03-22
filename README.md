This project was bootstrapped with [express-generator](https://github.com/expressjs/generator).<br>
This the repo of the Flaws's dummy website.

## Available Scripts
Clone the directory - 
`git clone https://github.com/sspeedy99/flaws-userAuthentication.git`

In the project directory, you can run:

### `npm install`

Install all the packages associated with the project.

### `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br>
You will also see any lint errors in the console.

### 2FA

The Website now have two factor authentication.<br>
First, the user will provide their details, then they recieve OTP on thier phone,which is valid for 90 mins. <br>
After verifying the OTP, user will be redirected to the homepage. If the user is not verified, they will be redirected to again enter the OTP <br>
The service is provide by MSG91(https://msg91.com/). The SDK sendotp(https://github.com/MSG91/sendotp-node) used is the API provided for Nodejs.


### Deployment

This is not a final version.<br>
The website is currently running on (https://fierce-temple-93818.herokuapp.com/).

