interface CloudflareEnv {
  DB: D1Database;
  IMAGES: R2Bucket;
  ASSETS: Fetcher;
  ADMIN_PASS: string;
  BREVO_API_KEY: string;
  BREVO_LIST_ID: string;
}
