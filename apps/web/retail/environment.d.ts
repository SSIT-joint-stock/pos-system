declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_BASE_URL: string;
			NEXT_PUBLIC_API_URL: string;
			NEXT_PUBLIC_SOCKET_URL: string;
			NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
		}
	}
}

export {};