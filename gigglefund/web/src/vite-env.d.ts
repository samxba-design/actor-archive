/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string;
  readonly VITE_GIGL_TOKEN_ADDRESS?: `0x${string}`;
  readonly VITE_LAUGH_TIP_ADDRESS?: `0x${string}`;
  readonly VITE_CHARITY_VAULT_ADDRESS?: `0x${string}`;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
