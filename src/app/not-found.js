import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-warm-white min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl md:text-8xl font-display font-bold text-charcoal-muted/20 mb-4">
          404
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal mb-3">
          Page Not Found
        </h1>
        <p className="font-body text-charcoal-muted mb-6 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to something delicious.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button href="/south-indian" variant="outline" size="lg">
            Browse Products
          </Button>
        </div>
      </div>
    </div>
  );
}
