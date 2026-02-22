export function TrustedBy() {
  const companies = ["Stripe", "Vercel", "Linear", "Notion", "Figma"];

  return (
    <section className="py-20 px-6 border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground mb-10 font-medium">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          {companies.map((company) => (
            <span
              key={company}
              className="text-2xl font-bold text-muted-foreground/60 hover:text-foreground/80 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
