import type { FooterData } from '../types/strapi';

interface FooterProps {
  data: FooterData;
}

export function Footer({ data }: FooterProps) {
  return (
    <footer className="border-t border-primary/30 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & text */}
          <div className="space-y-3">
            <a href={data.logo?.href || '/'} className="font-mono text-lg font-bold text-primary tracking-wider">
              {data.logo?.label || 'SITE'}
            </a>
            {data.text && (
              <p className="text-muted-foreground text-sm">{data.text}</p>
            )}
          </div>

          {/* Nav links */}
          <div>
            <h4 className="font-mono text-sm text-primary mb-3 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2">
              {data.navItems?.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h4 className="font-mono text-sm text-primary mb-3 uppercase tracking-widest">Social</h4>
            <ul className="space-y-2">
              {data.socialLinks?.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} {data.logo?.label || 'SITE'}. {data.text}
          </p>
        </div>
      </div>
    </footer>
  );
}