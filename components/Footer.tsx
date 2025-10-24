"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Building,
  Globe,
  DollarSign,
  MessageSquare,
  Send,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Zap,
  Check,
  CheckCircle,
  Target,
  TrendingUp,
  Award,
  Handshake,
} from "lucide-react";

const socialMedia = [
  { id: 1, img: "/link.svg", url: "https://linkedin.com" },
  { id: 2, img: "/git.svg", url: "https://github.com" },
  { id: 3, img: "/twit.svg", url: "https://twitter.com" },
];

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) => {
  const baseClasses =
    "px-8 py-4 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 relative overflow-hidden";
  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
      "border border-white/10 hover:border-white/20 text-white hover:bg-white/5 backdrop-blur-xl",
  };

  return (
    <motion.button
      type={type}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.03]" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const Input = ({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  icon?: any;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300 flex items-center gap-2 pl-1">
      {Icon && <Icon className="w-4 h-4 text-purple-400" />}
      {label}
    </label>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/[0.05] backdrop-blur-xl"
      />
    </div>
  </div>
);

const BudgetSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const budgetOptions = [
    { value: "£1K", label: "£1K", subtitle: "Starter" },
    { value: "£3K", label: "£3K", subtitle: "Professional" },
    { value: "£5K", label: "£5K", subtitle: "Premium" },
    { value: "£10K+", label: "£10K+", subtitle: "Enterprise" },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 flex items-center gap-2 pl-1">
        <DollarSign className="w-4 h-4 text-purple-400" />
        Investment Budget *
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {budgetOptions.map((option) => (
          <motion.button
            key={option.value}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(option.value)}
            className={`relative p-4 rounded-2xl border transition-all duration-300 ${
              value === option.value
                ? "bg-purple-500/20 border-purple-400/50 shadow-lg shadow-purple-500/20"
                : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-0.5">
                {option.label}
              </div>
              <div className="text-xs text-gray-400">{option.subtitle}</div>
            </div>
            {value === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange("not-sure")}
        className={`w-full mt-2 px-4 py-3 rounded-2xl border text-sm transition-all duration-300 ${
          value === "not-sure"
            ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
            : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] text-gray-400"
        }`}
      >
        💭 Not sure yet - Let&apos;s discuss
      </button>
    </div>
  );
};

const Footer = () => {
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
  const [spotsLeft, setSpotsLeft] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => (prev > 1 ? prev - 1 : 3));
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.budget ||
      !formData.brief
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("company", formData.company);
      form.append("website", formData.website);
      form.append("budget", formData.budget);
      form.append("brief", formData.brief);
      form.append("timestamp", new Date().toISOString());
      form.append("_subject", `New Website Lead - ${formData.budget} Budget`);

      const response = await fetch("https://formspree.io/f/xanbaqrg", {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setIsSubmitted(true);
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

  const trustIndicators = [
    { icon: Shield, text: "100% Secure & Confidential" },
    { icon: Clock, text: "48hr Response Guarantee" },
    { icon: Star, text: "5-Star Rated Developer" },
    { icon: Zap, text: "Free Strategy Session" },
  ];

  const impactStats = [
    {
      label: "Avg. Revenue Boost",
      value: "285%",
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      label: "Client Success Rate",
      value: "99.7%",
      icon: Target,
      color: "text-blue-400",
    },
    {
      label: "Happy Clients",
      value: "30+",
      icon: Award,
      color: "text-purple-400",
    },
    {
      label: "Project ROI",
      value: "12x",
      icon: DollarSign,
      color: "text-yellow-400",
    },
  ];

  return (
    <footer
      className="w-full pt-20 pb-10 relative overflow-hidden"
      id="contact"
    >
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="flex flex-col items-center relative z-10">
        {/* Refined Contact Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 px-4 md:px-0"
        >
          {/* Availability Tag */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-10">
            <Clock className="w-4 h-4 text-purple-300" />
            <span className="text-gray-300 font-medium tracking-wide text-sm md:text-base">
              Currently accepting {spotsLeft} new projects
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.15]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200">
              Let’s Create Something
            </span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Exceptional
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mt-2 mb-12 leading-relaxed">
            Clean design. Seamless performance. Built for impact.
          </p>

          {/* Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 mb-14 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Award,
                label: "Projects Delivered",
                value: "50+",
                color: "text-purple-400",
              },
              {
                icon: Target,
                label: "Client Retention Rate",
                value: "95%",
                color: "text-blue-400",
              },
              {
                icon: Star,
                label: "Average Rating",
                value: "5.0★",
                color: "text-yellow-400",
              },
              {
                icon: TrendingUp,
                label: "Active Partnerships",
                value: "20+",
                color: "text-green-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.04, y: -3 }}
                className="text-center p-5 md:p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-white/[0.08] transition-all"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className={`text-3xl font-semibold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 font-light tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4">
            {[
              { icon: Shield, text: "Trusted by Clients" },
              { icon: Star, text: "Top-Rated Developer" },
              { icon: Zap, text: "Quick Turnaround" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-4 py-2.5 backdrop-blur-sm hover:bg-white/[0.06] transition-all"
              >
                <item.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="text-center py-16 border-green-500/20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    Thanks for reaching out!
                  </h3>
                  <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
                    I&apos;ll review your project and get back to you within 24
                    hours with a personalized strategy.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="http://wa.me/447459239536"
                      className="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
                    >
                      WhatsApp for urgent questions
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Your Name *"
                        icon={User}
                        type="text"
                        required
                        value={formData.name}
                        onChange={(value) =>
                          setFormData({ ...formData, name: value })
                        }
                        placeholder="John Smith"
                      />
                      <Input
                        label="Email Address *"
                        icon={Mail}
                        type="email"
                        required
                        value={formData.email}
                        onChange={(value) =>
                          setFormData({ ...formData, email: value })
                        }
                        placeholder="john@company.com"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Company Name"
                        icon={Building}
                        type="text"
                        value={formData.company}
                        onChange={(value) =>
                          setFormData({ ...formData, company: value })
                        }
                        placeholder="Your Company Ltd"
                      />
                      <Input
                        label="Current Website"
                        icon={Globe}
                        type="url"
                        value={formData.website}
                        onChange={(value) =>
                          setFormData({ ...formData, website: value })
                        }
                        placeholder="https://yoursite.com"
                      />
                    </div>

                    <BudgetSelector
                      value={formData.budget}
                      onChange={(value) =>
                        setFormData({ ...formData, budget: value })
                      }
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300 flex items-center gap-2 pl-1">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        Tell me about your project *
                      </label>
                      <div className="relative">
                        <textarea
                          required
                          rows={5}
                          className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 hover:bg-white/[0.05] backdrop-blur-xl resize-none"
                          value={formData.brief}
                          onChange={(e) =>
                            setFormData({ ...formData, brief: e.target.value })
                          }
                          placeholder="What are your goals? What challenges are you facing? Any specific features in mind?"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      className="w-full text-lg py-5"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      <span className="flex items-center justify-center gap-3">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </span>
                    </Button>

                    <div className="text-center pt-6 border-t border-white/5">
                      <p className="text-sm text-gray-500 mb-3">
                        Prefer to chat directly?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
                        <a
                          href="http://wa.me/447459239536"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          WhatsApp →
                        </a>
                        <a
                          href="mailto:hello@tanveersingh.dev"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          Email →
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex mt-24 md:flex-row flex-col justify-between items-center relative z-10 px-5"
      >
        <p className="text-sm text-gray-500">Copyright © 2025 Tanveer Singh</p>

        <div className="flex items-center gap-4 mt-6 md:mt-0">
          {socialMedia.map((info) => (
            <motion.a
              key={info.id}
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex justify-center items-center bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <img
                src={info.img}
                alt="social"
                width={20}
                height={20}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
