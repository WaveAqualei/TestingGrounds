const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: 'us-east-2' });

function streamToString(stream) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("error", reject);
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
	});
}

module.exports = {
	list: function() {
		return s3Client.send(new ListObjectsV2Command({
			Bucket: process.env.S3_BUCKET_NAME,
		})).then(function(data) {
			return data.Contents.map(file=>file.Key);
		});
	},
	load: function(filename) {
		return s3Client.send(new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: filename,
		})).then(function(data) {
			return streamToString(data.Body);
		});
	},
	store: function(filename, data) {
		return s3Client.send(new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: filename,
			Body: data,
		}));
	},
};