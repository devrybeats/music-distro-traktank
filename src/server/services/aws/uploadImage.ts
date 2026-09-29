import { env } from "@/env";
import S3Client from "aws-sdk/clients/s3";
import { type User } from "next-auth";

const s3 = new S3Client({
  accessKeyId: env.BUCKET_ACCESS_KEY_ID,
  secretAccessKey: env.BUCKET_SECRET_ACCESS_KEY,
});

export const uploadImage = async (
  user: User,
  fileName: string,
  image: string,
) => {
  if (!env.BUCKET_NAME || !env.BUCKET_ACCESS_KEY_ID) {
    console.warn("[AI Studio] AWS S3 bucket not configured — returning image data directly");
    return image;
  }

  const base64Data = Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  );

  await s3
    .putObject({
      Bucket: env.BUCKET_NAME,
      Key: `${user.email}/${fileName}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: "image/png",
    })
    .promise();

  return `https://${env.BUCKET_NAME}.s3.amazonaws.com/${user.email}/${fileName}`;
};
