declare module "newrelic";

type NewRelicBrowserAttributes = Record<
	string,
	string | number | boolean | null | undefined
>;

interface NewRelicBrowserApi {
	addPageAction?: (name: string, attributes?: NewRelicBrowserAttributes) => void;
	noticeError?: (
		error: Error,
		customAttributes?: NewRelicBrowserAttributes,
	) => void;
	recordCustomEvent?: (
		eventType: string,
		attributes?: NewRelicBrowserAttributes,
	) => void;
}

interface Window {
	__nrBrowserInitialized?: boolean;
	newrelic?: NewRelicBrowserApi;
}
