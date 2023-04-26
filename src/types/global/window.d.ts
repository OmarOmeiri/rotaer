export {};

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize(config: GoogleIDConfig): void
          prompt(cb?: (notification: unknown) => void);
          renderButton(parent: HTMLElement, config: GoogleAuthButtonConfig): void;
          disableAutoSelect(): void
          revoke(emailOrSub: string)
        },
      }
    }
    OneSignal: any
  }
}
