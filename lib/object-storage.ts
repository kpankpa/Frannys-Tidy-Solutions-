import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type ObjectStorageConfig = {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  /** Public base URL without trailing slash, e.g. https://....neon.tech/frannys-media */
  publicBaseUrl: string;
};

function trimSlash(value: string) {
  return value.replace(/\/+$/, "");
}

/** Neon Object Storage / any S3-compatible bucket (R2, etc.). */
export function getObjectStorageConfig(): ObjectStorageConfig | null {
  const endpoint =
    process.env.STORAGE_S3_ENDPOINT?.trim() ||
    process.env.AWS_ENDPOINT_URL_S3?.trim() ||
    "";
  const region =
    process.env.STORAGE_S3_REGION?.trim() ||
    process.env.AWS_REGION?.trim() ||
    "us-east-2";
  const accessKeyId =
    process.env.STORAGE_S3_ACCESS_KEY_ID?.trim() ||
    process.env.AWS_ACCESS_KEY_ID?.trim() ||
    "";
  const secretAccessKey =
    process.env.STORAGE_S3_SECRET_ACCESS_KEY?.trim() ||
    process.env.AWS_SECRET_ACCESS_KEY?.trim() ||
    "";
  const bucket =
    process.env.STORAGE_S3_BUCKET?.trim() ||
    process.env.NEON_STORAGE_BUCKET?.trim() ||
    // Neon Connect modal sample uses bucket name "assets"
    process.env.NEON_STORAGE_BUCKET_NAME?.trim() ||
    "";
  const endpointClean = trimSlash(endpoint);
  const publicBaseUrl = trimSlash(
    process.env.STORAGE_PUBLIC_BASE_URL?.trim() ||
      process.env.NEON_STORAGE_PUBLIC_URL?.trim() ||
      // Neon public_read URLs are path-style: {endpoint}/{bucket}/{key}
      (endpointClean && bucket ? `${endpointClean}/${bucket}` : ""),
  );

  if (!endpointClean || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return {
    endpoint: endpointClean,
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl,
  };
}

export function isObjectStorageConfigured() {
  return getObjectStorageConfig() !== null;
}

function createClient(config: ObjectStorageConfig) {
  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
}

export function publicUrlForKey(config: ObjectStorageConfig, key: string) {
  return `${config.publicBaseUrl}/${key.replace(/^\/+/, "")}`;
}

export function keyFromPublicUrl(config: ObjectStorageConfig, url: string) {
  const prefix = `${config.publicBaseUrl}/`;
  if (!url.startsWith(prefix)) return null;
  return url.slice(prefix.length);
}

export async function putObject(input: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  const config = getObjectStorageConfig();
  if (!config) {
    throw new Error("Object storage is not configured.");
  }

  const client = createClient(config);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
    }),
  );

  return {
    key: input.key,
    url: publicUrlForKey(config, input.key),
  };
}

export type ListedObject = {
  key: string;
  sizeBytes: number;
  modifiedAt: string;
  url: string;
};

export async function listObjects(prefix = "media/"): Promise<ListedObject[]> {
  const config = getObjectStorageConfig();
  if (!config) return [];

  const client = createClient(config);
  const items: ListedObject[] = [];
  let continuationToken: string | undefined;

  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: config.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 200,
      }),
    );

    for (const object of page.Contents ?? []) {
      if (!object.Key || object.Key.endsWith("/")) continue;
      items.push({
        key: object.Key,
        sizeBytes: object.Size ?? 0,
        modifiedAt: (object.LastModified ?? new Date()).toISOString(),
        url: publicUrlForKey(config, object.Key),
      });
    }

    continuationToken = page.IsTruncated
      ? page.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return items.sort(
    (a, b) =>
      new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
  );
}

export async function deleteObject(key: string) {
  const config = getObjectStorageConfig();
  if (!config) {
    throw new Error("Object storage is not configured.");
  }

  const client = createClient(config);
  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
}
