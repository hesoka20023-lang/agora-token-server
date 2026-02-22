const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const PORT = process.env.PORT || 3000;

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.get('/getToken', (req, res) => {
    const channelName = req.query.channelName;
    if (!channelName) {
        return res.status(400).json({ 'error': 'channelName is required' });
    }

    const uid = 0; 
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; 
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpiredTs);

    res.header("Access-Control-Allow-Origin", "*");
    return res.json({ 'token': token });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
