const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = (req, res) => {
    // تفعيل الـ CORS عشان الموبايل يقدر يكلم السيرفر
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    // للتعامل مع طلبات الـ OPTIONS اللي بيبعتها المتصفح أحياناً
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { channelName } = req.query;

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
        return res.status(200).json({ token });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
