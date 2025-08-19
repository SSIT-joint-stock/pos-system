import { env } from "@repo/config-env";

export function buildVerifyLink(token: string) {
    const base = env.BASE_URL?.replace(/\/$/, "") || "http://localhost:8080";
    // console.log("------------------------------------------------", encodeURIComponent(token));
    return `${base}/api/v1/auth/verify-code-by-email-link?token=${encodeURIComponent(token)}`;
}