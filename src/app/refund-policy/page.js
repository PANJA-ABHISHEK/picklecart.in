export const metadata = { title: "Refund & Cancellation Policy" };

export default function RefundPolicyPage() {
  return (
    <div className="bg-warm-white min-h-screen">
      <div className="bg-heritage-green-dark py-14 md:py-16">
        <div className="container-main text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-warm-white">Refund &amp; Cancellation Policy</h1>
        </div>
      </div>
      <div className="container-main py-10 md:py-14 max-w-3xl mx-auto">
        <div className="prose prose-sm font-body text-charcoal-light space-y-6">
          <p>We want you to be completely satisfied with your PickleCart purchase.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Cancellation</h2>
          <p>Orders can be cancelled within 24 hours of placement, provided they have not been dispatched. Please contact us at picklecartblr@gmail.com to request a cancellation.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Refunds</h2>
          <p>If you receive a damaged or incorrect product, please contact us within 48 hours of delivery with photos. We will arrange a replacement or refund.</p>
          <h2 className="font-display text-xl font-bold text-charcoal">Returns</h2>
          <p>Due to the nature of food products, we do not accept returns for opened items. Unopened items may be returned within 7 days of delivery.</p>
        </div>
      </div>
    </div>
  );
}
