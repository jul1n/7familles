import Script from "next/script";
import { ANALYTICS_CODE } from "@/lib/analytics";

// Compteur de visites sans cookies : rien n'est chargé tant que le code GoatCounter n'est pas configuré
export default function Analytics() {
  if (!ANALYTICS_CODE || process.env.NODE_ENV !== "production") return null;
  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={`https://${ANALYTICS_CODE}.goatcounter.com/count`}
      strategy="afterInteractive"
    />
  );
}
