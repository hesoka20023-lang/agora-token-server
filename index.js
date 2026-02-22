const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const app = express();

app.use(express.json());

// تفعيل الـ CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/getToken', (req, res) => {
    const channelName = req.query.channelName;
    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    const appId = process.env.APP_ID;
    const appCertificate = process.env.APP_CERTIFICATE;
    const uid = 0;
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    try {
        const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
        return res.json({ token });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// تصدير التطبيق لـ Vercel
module.exports = app;
