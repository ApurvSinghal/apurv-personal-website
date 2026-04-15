/** @type {import('next').NextConfig} */
const nextConfig = {
	serverExternalPackages: ["newrelic"],
	async headers() {
		const nrBeacon = "bam.eu01.nr-data.net";
		const csp = [
			"default-src 'self'",
			`script-src 'self' 'unsafe-inline' 'unsafe-eval' https://${nrBeacon} https://www.googletagmanager.com`,
			`connect-src 'self' https://${nrBeacon} https://vitals.vercel-insights.com`,
			`img-src 'self' data: blob:`,
			`style-src 'self' 'unsafe-inline'`,
			`font-src 'self'`,
			`frame-ancestors 'none'`,
		].join("; ");

		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: csp,
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				],
			},
		];
	},
};

export default nextConfig;
