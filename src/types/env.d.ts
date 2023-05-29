declare global {
  namespace NodeJS {

    interface Env {
      readonly NODE_ENV: 'development' | 'test' | 'production' | undefined;
      // PASSWORDS
      readonly AWS_ID_LULLOS3: string;
      readonly AWS_SECRET_LULLOS3: string;
      readonly LULLO_ADMIN_PASSWORD_ENCRYPTION_KEY: string;
      readonly LULLO_ADMIN_PASSWORD: string;
      readonly HASH: string;
      readonly DEFAULT_ENCRYPTION_KEY: string;
      readonly GOOGLE_OAUTH_ID: string;
      readonly GOOGLE_OAUTH_SECRET: string;
      readonly AUTH_TOKEN_ENCRYPTION_KEY: string;
      // AWS
      readonly AWS_REGION: string;
      readonly AWS_BUCKET_URL: string;
      readonly AWS_BUCKET_NAME: string;
      // API
      readonly NEXT_PUBLIC_API_URL: string;
      // MISC
      readonly SENTRY_URI: string;
      readonly EXTEND_ESLINT: string;
      readonly BUILD_PATH: string;
      readonly NEXT_PUBLIC_GMAPS_API_KEY: string;
      readonly NEXT_PUBLIC_GMAPS_MAP_ID: string;
      readonly NEXT_PUBLIC_REDEMET_API_KEY: string;
      readonly MONGO_USER: string;
      readonly MONGO_PASSWORD: string;
    }
    interface ProcessEnv extends Env {}
  }
}

export {};
