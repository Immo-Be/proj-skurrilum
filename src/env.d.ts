/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DEV_BASE_URL: string;
  // Add other environment variables used in your project
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
