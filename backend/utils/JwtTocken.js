const sendToken = (user, statusCode, res) => {

    // Create Jwt token
    const token = user.getJwtToken();

    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() +   1000*36000
        ),
        httpOnly: true
    }


    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })

}

module.exports = sendToken;