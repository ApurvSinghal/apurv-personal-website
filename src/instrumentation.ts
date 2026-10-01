import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "apurv-personal-website",
  });
}
