import {
  type OAuthAuthStrategy,
  type OAuthInitParams,
  type OAuthCallbackParams,
  type AuthResult,
} from "../../interfaces/auth.interface";

export class OAuthStrategy implements OAuthAuthStrategy {
  public readonly name = "oauth" as const;

  canHandle(): boolean {
    return true;
  }

  async init(
    params: OAuthInitParams
  ): Promise<{ authUrl: string; state?: string }> {
    // Base stub: construct provider auth URL (not implemented)
    const base = `https://auth.example.com/${params.provider}/authorize`;
    const authUrl = `${base}?redirect_uri=${encodeURIComponent(params.redirectUri)}&state=${encodeURIComponent(params.state || "")}`;
    return { authUrl, state: params.state };
  }

  async callback(_params: OAuthCallbackParams): Promise<AuthResult> {
    // Base stub: should exchange code for tokens and map to user
    throw new Error("OAUTH_NOT_IMPLEMENTED");
  }
}
