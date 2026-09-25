export default function PrivacyPage() {
  return (
    <main className="animate-in fade-in duration-500 prose prose-stone dark:prose-invert">
      <h1 className="font-serif text-4xl text-ink tracking-tight mb-8">Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Introduction</h2>
      <p>Eka is a personal discipline tracker. We believe in minimal data collection and your absolute right to privacy. We only collect the data necessary to provide the service.</p>
      
      <h2>2. Data We Collect</h2>
      <ul>
        <li><strong>Account Data:</strong> Your email address (used only for authentication).</li>
        <li><strong>Usage Data:</strong> Your daily checklist items, custom templates, and any notes you write.</li>
        <li><strong>Push Data:</strong> VAPID endpoint subscriptions if you opt-in to notifications.</li>
      </ul>

      <h2>3. Data Usage</h2>
      <p>Your data is used exclusively to render your dashboard and calculate your streaks. We do not sell, rent, or share your data with any third parties. There are no tracking scripts, analytics pixels, or ad networks installed on this application.</p>

      <h2>4. Data Ownership & Deletion</h2>
      <p>You own your data. You can export your data to JSON at any time from the Settings page. If you wish to delete your account and all associated data permanently, please contact us.</p>
    </main>
  );
}
