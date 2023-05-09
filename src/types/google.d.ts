interface GoogleIDConfig {
  /* Your application's client ID */
  client_id: string;
  /* Enables automatic selection. */
  auto_select?: boolean
  /* The JavaScript function that handles ID tokens. Google One Tap and the Sign In With Google button popup UX mode use this attribute. */
  callback: (data: {credential: string, select_by: GoogleIdAuthSelectBy}) => void
  /* The URL of your login endpoint. The Sign In With Google button redirect UX mode uses this attribute. */
  login_uri?: string
  /* The JavaScript function that handles password credentials. */
  native_callback?: (id: any) => void
  /* Cancels the prompt if the user clicks outside the prompt. */
  cancel_on_tap_outside?: boolean
  /* The DOM ID of the One Tap prompt container element */
  prompt_parent_id?: string;
  /* A random string for ID tokens */
  nonce?: string;
  /* The title and words in the One Tap prompt */
  context?: string;
  /* If you need to call One Tap in the parent domain and its subdomains, pass the parent domain to this field so that a single shared cookie is used. */
  state_cookie_domain?: string;
  /* The Sign In With Google button UX flow */
  ux_mode?: 'popup' | 'redirect'
  /* The origins that are allowed to embed the intermediate iframe. One Tap will run in the intermediate iframe mode if this field presents. */
  allowed_parent_origin?: string | string[]
  /* Overrides the default intermediate iframe behavior when users manually close One Tap. */
  intermediate_iframe_close_callback?: () => void
  /* Enables upgraded One Tap UX on ITP browsers. */
  itp_support?: boolean;
}

type GoogleIdAuthSelectBy =
  /** Automatic sign-in of a user with an existing session who had previously granted consent to share credentials. */
 | 'auto'
 /* A user with an existing session who had previously granted consent pressed the One Tap 'Continue as' button to share credentials. */
 | 'user'
 /* A user with an existing session pressed the One Tap 'Continue as' button to grant consent and share credentials. Applies only to Chrome v75 and higher. */
 | 'user_1tap'
 /* A user without an existing session pressed the One Tap 'Continue as' button to select an account and then pressed the Confirm button in a pop-up window to grant consent and share credentials. Applies to non-Chromium based browsers. */
 | 'user_2tap'
 /* A user with an existing session who previously granted consent pressed the Sign In With Google button and selected a Google Account from 'Choose an Account' to share credentials. */
 | 'btn'
 /* A user with an existing session pressed the Sign In With Google button and pressed the Confirm button to grant consent and share credentials. */
 | 'btn_confirm'
 /* A user without an existing session who previously granted consent pressed the Sign In With Google button to select a Google Account and share credentials. */
 | 'btn_add_session'
 /* A user without an existing session first pressed the Sign In With Google button to select a Google Account and then pressed the Confirm button to consent and share credentials. */
 | 'btn_confirm_add_session'

interface GoogleAuthButtonConfig {
  /* The button type: icon, or standard button. */
  type: 'standard' | 'icon',
  /* The button theme. For example, filled_blue or filled_black. */
  theme?: 'outline' | 'filled_black' | 'filled_blue',
  /* The button size. For example, small or large. */
  size?: 'large' | 'medium' | 'small',
  /* The button text. For example, "Sign in with Google" or "Sign up with Google". */
  text?: string,
  /* The button shape. For example, rectangular or circular. */
  shape?: 'retangular' | 'pill' | 'circle' | 'square',
  /* The Google logo alignment: left or center. */
  logo_alignment?: 'left' | 'center',
  /* The button width, in pixels. */
  width?: `${number}`,
  /* If set, then the button language is rendere */
  locale?: string
}

interface GAuthResponse {
  /** Issuer */
  iss: string,
  nbf: number,
  /** My ID */
  aud: string,
  /** If present, the host domain of the user's GSuite email address */
  hd?: string,
  /** The unique ID of the user's Google Account */
  sub: string,
  email: string,
  email_verified: boolean,
  azp: string,
  name: string,
  picture: string,
  given_name: string,
  family_name: string,
  /** Creation time */
  iat: number,
  /** Expires at */
  exp: number,
  jti: string
}
