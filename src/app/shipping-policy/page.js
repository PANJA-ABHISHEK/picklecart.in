export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <div className="bg-heritage-green-dark py-14 md:py-16">
        <div className="container-main text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-white">Shipping Policy</h1>
        </div>
      </div>
      <div className="container-main py-10 md:py-14 max-w-3xl mx-auto">
        <div className="prose prose-sm font-body text-charcoal-light space-y-6">
          <p>We are committed to delivering your PickleCart products safely and on time.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Delivery Coverage</h2>
          <p>We deliver to all major cities and towns across India via Shiprocket and our trusted courier partners.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Delivery Times</h2>
          <p>Orders are dispatched within 1–2 business days. Standard delivery takes 4–7 business days depending on your location.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Shipping Charges</h2>
          <p>Shipping charges are calculated at checkout based on your location and order value. Free shipping may be available for orders above a certain value.</p>
        </div>
      </div>
    </div>
  );
}
