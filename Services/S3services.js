const AWS = require('aws-sdk')

const uploadToS3 = async function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetracker777';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,

    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    try {
        const s3Response = await s3bucket.upload(params).promise();
        console.log('Upload success', s3Response);
        return s3Response.Location;
    } catch (err) {
        console.error('Upload failed:', err);
        throw err;
    }
}
module.exports = {
    uploadToS3
}