import { Terminal, Github } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations", "Changelog"]
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"]
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Status"]
  }
];

const socialLinks = [
  { name: "GitHub", icon: Github },
  { name: "Twitter", icon: null },
  { name: "Discord", icon: null },
  { name: "LinkedIn", icon: null }
];

export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-border bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
                <Terminal className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Mergewise</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered code review for modern development teams.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-muted-foreground">
            © 2025 Mergewise. All rights reserved.
          </div>
          <div className="flex items-center gap-8">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {social.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
