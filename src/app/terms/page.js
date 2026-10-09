export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <div className="bg-heritage-green-dark py-14 md:py-16">
        <div className="container-main text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-white">Terms &amp; Conditions</h1>
        </div>
      </div>
      <div className="container-main py-10 md:py-14 max-w-3xl mx-auto">
        <div className="prose prose-sm font-body text-charcoal-light space-y-6">
          <p>By using the PickleCart website, you agree to these terms and conditions. Please read them carefully before making a purchase.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Orders & Payments</h2>
          <p>All orders are subject to availability. Prices are listed in Indian Rupees (INR) and include applicable taxes. Payment is processed securely through Razorpay.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Delivery</h2>
          <p>We deliver across India. Standard delivery takes 4–7 business days. Delivery times may vary based on location and availability.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Contact</h2>
          <p>For questions about our terms, please contact us at hello@picklecart.in.</p>
        </div>
      </div>
    </div>
  );
}
