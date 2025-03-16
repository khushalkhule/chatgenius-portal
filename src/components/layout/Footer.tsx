
import { Link } from "react-router-dom";
import AnimatedTransition from "../ui-custom/AnimatedTransition";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 mt-20 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <AnimatedTransition animation="slide-up" delay={100}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                  AI
                </span>
                <span className="font-semibold text-xl">ChatSaaS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade AI chatbot platform designed for seamless website integration
              </p>
            </div>
          </AnimatedTransition>

          <AnimatedTransition animation="slide-up" delay={200}>
            <div>
              <h3 className="font-medium text-sm mb-4 text-muted-foreground uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/features"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/integrations"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/roadmap"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
          </AnimatedTransition>

          <AnimatedTransition animation="slide-up" delay={300}>
            <div>
              <h3 className="font-medium text-sm mb-4 text-muted-foreground uppercase tracking-wider">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/docs"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/guides"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/api"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </AnimatedTransition>

          <AnimatedTransition animation="slide-up" delay={400}>
            <div>
              <h3 className="font-medium text-sm mb-4 text-muted-foreground uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customers"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Customers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </AnimatedTransition>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ChatSaaS Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
