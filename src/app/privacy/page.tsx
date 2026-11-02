import { Container } from "@/components/layout/Container";
import { pageMetadata } from "@/lib/page-metadata";
import { ADSENSE_CLIENT, SITE_NAME } from "@/lib/site-config";

const LINK = "font-medium text-zinc-900 underline dark:text-zinc-50";

export const metadata = pageMetadata({
  title: `Privacy Policy — ${SITE_NAME}`,
  description: `Privacy policy for ${SITE_NAME}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="flex flex-1 flex-col gap-4 py-12 text-zinc-700 dark:text-zinc-300">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Privacy Policy</h1>
      <p>Last updated: 2026-11-02</p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Calculator input</h2>
      <p>
        Calculator inputs (measurements and other values you type) are processed locally in your browser
        and are not intentionally transmitted to or stored on our servers.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">No accounts, no database</h2>
      <p>
        {SITE_NAME} does not require account creation and does not operate a database of user content.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Analytics</h2>
      <p>
        We use Cloudflare Web Analytics to understand website traffic and page performance. The
        analytics service is provided by Cloudflare, and its script is added to our pages by
        Cloudflare.
      </p>
      <p>
        Analytics may report page views, visited paths, referrers, approximate visitor locations (such
        as country), device type, browser and operating system, and performance metrics such as page
        load time and Core Web Vitals.
      </p>
      <p>
        According to Cloudflare&apos;s documentation, Web Analytics does not use cookies or
        localStorage to track visitors. Calculator inputs are processed locally in your browser and are not
        intentionally sent to our servers as part of analytics. For details, see{" "}
        <a
          href="https://www.cloudflare.com/web-analytics/"
          className="font-medium text-zinc-900 underline dark:text-zinc-50"
          rel="noopener noreferrer"
        >
          Cloudflare Web Analytics
        </a>{" "}
        and its{" "}
        <a
          href="https://developers.cloudflare.com/web-analytics/"
          className="font-medium text-zinc-900 underline dark:text-zinc-50"
          rel="noopener noreferrer"
        >
          documentation
        </a>
        .
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Advertising</h2>
      {ADSENSE_CLIENT ? (
        <>
          <p>
            We show ads served by Google AdSense. Google and its partners use cookies and similar
            technologies to serve ads, to limit how often you see an ad, to measure ad performance, and
            to prevent fraud. If you have consented (or where consent is not required), ads may be
            personalized based on your visits to this and other websites.
          </p>
          <p>
            Visitors in the European Economic Area, the United Kingdom and Switzerland are asked for
            consent through a consent message before personalized ads are shown, and can change their
            choice at any time through that message. Ads never have access to what you type into our
            calculators: your input stays in your browser.
          </p>
          <p>
            You can learn{" "}
            <a href="https://policies.google.com/technologies/partner-sites" className={LINK} rel="noopener noreferrer">
              how Google uses information from sites that use its services
            </a>
            , and you can turn off personalized advertising in{" "}
            <a href="https://myadcenter.google.com/" className={LINK} rel="noopener noreferrer">
              My Ad Center
            </a>
            .
          </p>
        </>
      ) : (
        <p>
          We do not currently run advertising on this site. If we enable it in the future (for example,
          Google AdSense), this policy will be updated beforehand to describe what data is collected and
          how it is used.
        </p>
      )}

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Hosting logs</h2>
      <p>
        Like most websites, our hosting provider may collect standard server logs (such as IP address
        and request metadata) for security and operational purposes. This is separate from the content
        you type into our calculators.
      </p>

      <h2 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Contact</h2>
      <p>Questions about this policy can be sent via the Contact page.</p>
    </Container>
  );
}
