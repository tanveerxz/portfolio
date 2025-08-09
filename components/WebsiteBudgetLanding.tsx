// components/WebsiteBudgetLanding.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronDownIcon,
  CheckIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// JSON-LD Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Website Development Services",
  description:
    "Professional website development services with transparent pricing at £500, £1K, and £3K budget levels.",
  provider: {
    "@type": "Person",
    name: "Tanveer",
    url: "https://codedbytanveer.com",
  },
  serviceType: "Website Development",
  areaServed: ["UK", "US"],
  offers: [
    {
      "@type": "Offer",
      name: "£500 Website Package",
      price: "500",
      priceCurrency: "GBP",
      description:
        "MVP landing page with mobile-first design, basic SEO, and analytics setup.",
    },
    {
      "@type": "Offer",
      name: "£1K Website Package",
      price: "1000",
      priceCurrency: "GBP",
      description:
        "3-5 page custom website with strong information architecture and SEO foundations.",
    },
    {
      "@type": "Offer",
      name: "£3K Website Package",
      price: "3000",
      priceCurrency: "GBP",
      description:
        "Full-featured website with custom animations, CMS, integrations, and performance optimization.",
    },
  ],
};

// Utility Components
const Button = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses =
    "px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost:
      "border border-gray-600 hover:border-gray-500 text-white hover:bg-gray-800",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 ${className}`}
  >
    {children}
  </div>
);

const Input = ({ label, ...props }: { label: string; [key: string]: any }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <input
      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      {...props}
    />
  </div>
);

const Select = ({
  label,
  children,
  ...props
}: {
  label: string;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">{label}</label>
    <select
      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      {...props}
    >
      {children}
    </select>
  </div>
);

const Accordion = ({
  items,
}: {
  items: { question: string; answer: string }[];
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-700 rounded-lg overflow-hidden"
        >
          <button
            className="w-full px-6 py-4 text-left bg-gray-800/50 hover:bg-gray-800/70 transition-colors flex items-center justify-between"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span className="font-medium text-white">{item.question}</span>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-400 transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === index && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="px-6 py-4 bg-gray-800/30 text-gray-300"
            >
              {item.answer}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function WebsiteBudgetLanding() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    budget: "",
    brief: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [utmParams, setUtmParams] = useState({ source: "", campaign: "" });

  useEffect(() => {
    // Parse UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    setUtmParams({
      source: urlParams.get("utm_source") || "",
      campaign: urlParams.get("utm_campaign") || "",
    });
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // Track CTA clicks
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "cta_click", {
        event_category: "engagement",
        event_label: id,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for Formspree submission
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("company", formData.company);
      form.append("website", formData.website);
      form.append("budget", formData.budget);
      form.append("brief", formData.brief);
      form.append("utm_source", utmParams.source);
      form.append("utm_campaign", utmParams.campaign);
      form.append("timestamp", new Date().toISOString());
      form.append("_subject", `New Website Lead - ${formData.budget} Budget`);

      // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
      const response = await fetch("https://formspree.io/f/xanbaqrg", {
        method: "POST",
        body: form,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSubmitted(true);

        // Track form submission
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "form_submit", {
            event_category: "conversion",
            event_label: "contact_form",
          });
        }
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(
        "There was an issue submitting the form. Please try again or contact me directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const packages = [
    {
      price: "£500",
      title: "MVP Landing",
      subtitle: "Perfect for startups & solopreneurs",
      deliverables: [
        "Single-page responsive website",
        "Mobile-first clean design",
        "Hero section + clear CTA",
        "Basic SEO setup",
        "Google Analytics 4 integration",
        "1 round of feedback & revisions",
      ],
      timeline: "3-5 days",
      notIncluded: [
        "Multiple pages",
        "Custom animations",
        "CMS or blog",
        "E-commerce functionality",
      ],
    },
    {
      price: "£1K",
      title: "Business Website",
      subtitle: "For established businesses",
      deliverables: [
        "3-5 pages (Home, Services, About, Contact)",
        "Custom responsive design",
        "Strong information architecture",
        "SEO foundations & meta tags",
        "Contact forms & analytics",
        "2 rounds of feedback & revisions",
      ],
      timeline: "1-2 weeks",
      notIncluded: [
        "Custom animations",
        "Blog or CMS",
        "Third-party integrations",
        "E-commerce features",
      ],
    },
    {
      price: "£3K",
      title: "Premium Experience",
      subtitle: "For growing companies",
      deliverables: [
        "5-10+ pages with custom design",
        "Smooth animations & interactions",
        "Blog/CMS integration",
        "Booking systems & form integrations",
        "Performance optimization pass",
        "Full SEO & Open Graph setup",
        "3 rounds of feedback & revisions",
      ],
      timeline: "2-4 weeks",
      notIncluded: [
        "Complex e-commerce (Shopify recommended)",
        "Custom web apps",
        "Ongoing maintenance (available separately)",
      ],
    },
  ];

  const portfolioItems = [
    {
      image: "/housingpro.png", // Image should be in public/housingpro.png
      result: "Modern property search with advanced filtering",
      title: "Housing Project",
      url: "https://housingpro.vercel.app/",
    },
    {
      image: "/imd.png", // Will use placeholder until you add screenshots
      result: "Professional B2B wholesale platform",
      title: "IMD Corporation",
      url: "https://imdcorporation.com",
    },
    {
      image: null,
      result: "Mobile-first design, 90+ Lighthouse score",
      title: "Performance-Optimized Site",
      url: "#",
    },
  ];

  const faqItems = [
    {
      question: "Which budget fits my business?",
      answer:
        "Not sure? Book a free 15-minute call and I'll help you figure out what makes sense based on your goals, timeline, and current situation. No pressure, just honest advice.",
    },
    {
      question: "How long does each project take?",
      answer:
        "£500 projects: 3-5 days. £1K projects: 1-2 weeks. £3K projects: 2-4 weeks. Timeline starts once I have your content, branding assets, and deposit.",
    },
    {
      question: "Do you help with content and copy?",
      answer:
        "I provide structure and guidance for content, but you'll need to provide the actual copy. I can recommend copywriters if you need help with writing.",
    },
    {
      question: "What about hosting and domains?",
      answer:
        "I can help you set up hosting (Vercel, Netlify) and connect your domain. Hosting costs are separate and typically £10-20/month depending on your needs.",
    },
    {
      question: "How does payment work?",
      answer:
        "50% deposit to start, 50% on completion. I accept bank transfer or PayPal. No hidden fees, no ongoing subscription unless you want maintenance.",
    },
    {
      question: "What if I need changes after launch?",
      answer:
        "Minor tweaks within the first week are free. Larger changes or additional features are quoted separately. I offer maintenance packages starting at £200/month.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              What You Get with a <span className="text-blue-400">£500</span> /{" "}
              <span className="text-purple-400">£1K</span> /{" "}
              <span className="text-green-400">£3K</span> Website
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A developer's honest breakdown — no fluff, just clear deliverables
              and realistic expectations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                variant="primary"
                onClick={() => scrollToSection("contact")}
                className="text-lg px-8 py-4"
              >
                Get a Free Audit
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("packages")}
                className="text-lg px-8 py-4"
              >
                See Packages
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Trusted by founders in UK/US</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your Investment Level
            </h2>
            <p className="text-lg text-gray-300">
              Honest pricing with clear deliverables at every level
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {pkg.price}
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{pkg.title}</h3>
                    <p className="text-gray-400">{pkg.subtitle}</p>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div>
                      <h4 className="font-medium text-green-400 mb-2">
                        ✓ What's included:
                      </h4>
                      <ul className="space-y-2">
                        {pkg.deliverables.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-300"
                          >
                            <CheckIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-yellow-400 mb-2">
                        ⏱️ Timeline:
                      </h4>
                      <p className="text-sm text-gray-300">{pkg.timeline}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-red-400 mb-2">
                        ✗ Not included:
                      </h4>
                      <ul className="space-y-1">
                        {pkg.notIncluded.map((item, i) => (
                          <li key={i} className="text-xs text-gray-400">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => scrollToSection("contact")}
                    >
                      Start with {pkg.price}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              Not sure which package fits your needs?
            </p>
            <Button variant="ghost" onClick={() => scrollToSection("contact")}>
              Get personalized advice →
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Recent Results
            </h2>
            <p className="text-lg text-gray-300">Real projects, real impact</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:border-gray-600 transition-colors">
                  <div className="bg-gray-700 rounded-lg h-48 mb-4 flex items-center justify-center overflow-hidden relative">
                    {item.image ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onLoad={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            // Hide fallback when image loads successfully
                            const fallback = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "none";
                          }}
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            // Hide image and show fallback on error
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget
                              .nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                          <span className="text-gray-500 text-center px-4">
                            {item.title} Screenshot
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-gray-500 text-center px-4">
                          {item.title} Screenshot
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-blue-400 font-medium mb-1">
                    {item.result}
                  </div>
                  <h3 className="font-semibold mb-3">{item.title}</h3>
                  {item.url !== "#" ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit live site <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 inline-flex items-center gap-1">
                      Coming soon <ArrowRightIcon className="w-4 h-4" />
                    </span>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              Why Work with Me
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                title: "Performance-First",
                description:
                  "Every site I build loads fast and scores 90+ on Lighthouse. No bloated themes or unnecessary plugins.",
              },
              {
                title: "Custom UI, No Bloat",
                description:
                  "Hand-coded designs that match your brand perfectly. Clean code that your future developer will thank you for.",
              },
              {
                title: "Clear Process",
                description:
                  "Know exactly what to expect at each stage. Regular updates, clear milestones, no surprises.",
              },
              {
                title: "Reliable Communication",
                description:
                  "I respond within 24 hours and keep you updated throughout the project. No ghosting, ever.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  {item.title}
                </h3>
                <p className="text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Common Questions
            </h2>
            <p className="text-lg text-gray-300">
              Everything you need to know before we start
            </p>
          </motion.div>

          <Accordion items={faqItems} />
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-gray-800/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Your Free Website Audit
            </h2>
            <p className="text-lg text-gray-300">
              Tell me about your project and I'll send you a personalized plan
              with honest recommendations.
            </p>
          </motion.div>

          {isSubmitted ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Thanks for reaching out!
              </h3>
              <p className="text-gray-300 mb-6">
                I'll review your project and send you a personalized audit
                within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.link/chdm9n"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  WhatsApp for urgent questions →
                </a>
                <a
                  href="mailto:hello@tanveersingh.dev"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Email me directly →
                </a>
              </div>
            </Card>
          ) : (
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    label="Name *"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    label="Company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Your company (optional)"
                  />
                  <Input
                    label="Current Website"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    placeholder="https://yoursite.com (optional)"
                  />
                </div>

                <Select
                  label="Budget Range *"
                  name="budget"
                  required
                  value={formData.budget}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                >
                  <option value="">Select your budget</option>
                  <option value="£500">£500</option>
                  <option value="£1K">£1K</option>
                  <option value="£3K">£3K</option>
                  <option value="not-sure">Not sure</option>
                </Select>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tell me about your project *
                  </label>
                  <textarea
                    name="brief"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={formData.brief}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, brief: e.target.value })
                    }
                    placeholder="What's your business? What's your main goal with this website? Any specific features you need?"
                  />
                </div>

                {/* Formspree honeypot field */}
                <input type="text" name="_gotcha" style={{ display: "none" }} />

                {/* Hidden fields for tracking */}
                <input
                  type="hidden"
                  name="utm_source"
                  value={utmParams.source}
                />
                <input
                  type="hidden"
                  name="utm_campaign"
                  value={utmParams.campaign}
                />
                <input
                  type="hidden"
                  name="_subject"
                  value={`New Website Lead - ${formData.budget} Budget`}
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full text-lg py-4"
                >
                  {isSubmitting ? "Sending..." : "Get My Audit & Plan"}
                </Button>

                <div className="text-center pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-4">
                    Prefer to chat directly?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://wa.link/chdm9n"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      WhatsApp →
                    </a>
                    <a
                      href="mailto:hello@tanveersingh.dev"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Email →
                    </a>
                  </div>
                </div>
              </form>
            </Card>
          )}
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 md:hidden z-50">
        <Button
          variant="primary"
          onClick={() => scrollToSection("contact")}
          className="w-full text-lg py-4"
        >
          Get Free Audit
        </Button>
      </div>

      {/* Bottom padding for mobile sticky CTA */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
