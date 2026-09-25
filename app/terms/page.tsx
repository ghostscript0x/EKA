export default function TermsPage() {
  return (
    <main className="animate-in fade-in duration-500 prose prose-stone dark:prose-invert">
      <h1 className="font-serif text-4xl text-ink tracking-tight mb-8">Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Agreement to Terms</h2>
      <p>By accessing Eka, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

      <h2>2. User Accounts</h2>
      <p>You are responsible for safeguarding the password that you use to access Eka and for any activities or actions under your password. Eka cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.</p>

      <h2>3. Acceptable Use</h2>
      <p>You agree not to use the service to abuse, harass, or spam others, or to reverse engineer, disrupt, or attack the infrastructure hosting the service. Automated scraping or brute-force requests will result in an immediate IP ban.</p>

      <h2>4. As-Is Provision</h2>
      <p>Eka is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the availability, reliability, or accuracy of the service.</p>
    </main>
  );
}
