export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <div className="bg-heritage-green-dark py-14 md:py-16">
        <div className="container-main text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-white">Privacy Policy</h1>
        </div>
      </div>
      <div className="container-main py-10 md:py-14 max-w-3xl mx-auto">
        <div className="prose prose-sm font-body text-charcoal-light space-y-6">
          <p>This privacy policy outlines how PickleCart collects, uses, and protects your personal information when you visit our website or make a purchase.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Information We Collect</h2>
          <p>We may collect your name, email address, phone number, delivery address, and payment information when you place an order or fill out a form on our website.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">How We Use Your Information</h2>
          <p>Your information is used to process orders, communicate updates, improve our services, and provide customer support. We do not sell your personal data to third parties.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Contact</h2>
          <p>If you have questions about our privacy practices, please contact us at hello@picklecart.in.</p>
        </div>
      </div>
    </div>
  );
}
