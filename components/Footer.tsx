"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
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
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

import { socialMedia } from "@/data";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses =
    "px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 relative overflow-hidden group";
  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105",
    ghost:
      "border-2 border-purple-500/30 hover:border-purple-400 text-white hover:bg-purple-500/10 backdrop-blur-sm",
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}
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
    className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 animate-pulse" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const Input = ({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon?: any;
  [key: string]: any;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-3"
  >
    <label className="block text-sm font-semibold text-gray-200 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-purple-400" />}
      {label}
    </label>
    <div className="relative group">
      <input
        className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:border-gray-500/70 backdrop-blur-sm"
        {...props}
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  </motion.div>
);

const Select = ({
  label,
  icon: Icon,
  children,
  ...props
}: {
  label: string;
  icon?: any;
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-3"
  >
    <label className="block text-sm font-semibold text-gray-200 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-purple-400" />}
      {label}
    </label>
    <div className="relative group">
      <select
        className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:border-gray-500/70 backdrop-blur-sm appearance-none cursor-pointer"
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </motion.div>
);

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
  const [utmParams, setUtmParams] = useState({ source: "", campaign: "" });
  const [spotsLeft, setSpotsLeft] = useState(3);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        source: urlParams.get("utm_source") || "",
        campaign: urlParams.get("utm_campaign") || "",
      });
    }
  }, []);

  // Urgency timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => (prev > 1 ? prev - 1 : 3));
    }, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-3">
            <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-orange-200 font-medium">
              🔥 Only {spotsLeft} project spots left this month
            </span>
          </div>
        </motion.div>

        {/* Main conversion section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center">
            {" "}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold lg:max-w-[45vw] text-center mb-6">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Ready to
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {" "}
                3x Your Revenue
              </span>
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                {" "}
                Too?
              </span>
            </h1>
          </div>

          <p className="text-gray-300 md:mt-6 my-5 text-center text-lg max-w-2xl mx-auto">
            Join 30+ successful businesses who've transformed their online
            presence with
            <span className="text-purple-400 font-semibold">
              {" "}
              conversion-focused development.
            </span>
          </p>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2"
              >
                <indicator.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{indicator.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced form */}
        <div className="w-full max-w-3xl mt-6">
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="text-center py-16 border-green-500/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
                  >
                    <CheckIcon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    🚀 Thanks for reaching out!
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    I'll review your project and send you a personalized audit
                    within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="http://wa.me/447459239536"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      📱 WhatsApp for urgent questions{" "}
                      <ArrowRight className="w-4 h-4" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href="mailto:hello@tanveersingh.dev"
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                      ✉️ Email me directly <ArrowRight className="w-4 h-4" />
                    </motion.a>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Get Your Free Website Audit 🎯
                    </h3>
                    <p className="text-gray-400">
                      Tell me about your project and I'll send you a
                      personalized strategy + competitive analysis
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Your Name *"
                        icon={User}
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Smith"
                      />
                      <Input
                        label="Email Address *"
                        icon={Mail}
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@company.com"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <Input
                        label="Company Name"
                        icon={Building}
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="Your Company Ltd"
                      />
                      <Input
                        label="Current Website"
                        icon={Globe}
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        placeholder="https://yoursite.com"
                      />
                    </div>

                    <Select
                      label="Investment Budget *"
                      icon={DollarSign}
                      name="budget"
                      required
                      value={formData.budget}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                    >
                      <option value="">💰 Select your investment range</option>
                      <option value="£1K">£1K - Starter Package</option>
                      <option value="£3K">£3K - Professional Package</option>
                      <option value="£5K">£5K - Premium Package</option>
                      <option value="£10K+">£10K+ - Enterprise Solution</option>
                      <option value="not-sure">🤔 Not sure yet</option>
                    </Select>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        Tell me about your project *
                      </label>
                      <div className="relative group">
                        <textarea
                          name="brief"
                          required
                          rows={5}
                          className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:border-gray-500/70 backdrop-blur-sm resize-none"
                          value={formData.brief}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) =>
                            setFormData({ ...formData, brief: e.target.value })
                          }
                          placeholder="What's your business about? What are your main goals? Any specific features you need? The more details, the better I can help! 🚀"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>

                    {/* Honeypot */}
                    <input
                      type="text"
                      name="_gotcha"
                      style={{ display: "none" }}
                    />

                    {/* Hidden tracking fields */}
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

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full text-lg py-5 font-bold text-white relative overflow-hidden group"
                        disabled={isSubmitting}
                      >
                        <span className="flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending Your Request...
                            </>
                          ) : (
                            <>
                              🎯 Get My Free Audit & Strategy
                              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </Button>
                    </motion.div>

                    <div className="text-center pt-6 border-t border-gray-700/50">
                      <p className="text-sm text-gray-400 mb-4">
                        🚀 Prefer to chat directly? I'm always available!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          href="http://wa.me/447459239536"
                          className="flex items-center justify-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
                        >
                          📱 WhatsApp <ArrowRight className="w-4 h-4" />
                        </motion.a>
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          href="mailto:hello@tanveersingh.dev"
                          className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                          ✉️ Email <ArrowRight className="w-4 h-4" />
                        </motion.a>
                      </div>
                    </div>
                  </form>
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
        className="flex mt-20 md:flex-row flex-col justify-between items-center relative z-10"
      >
        <p className="md:text-base text-sm md:font-normal font-light text-gray-400">
          Copyright © 2025 Tanveer Singh
        </p>

        <div className="flex items-center md:gap-3 gap-6 mt-4 md:mt-0">
          {socialMedia.map((info) => (
            <motion.div
              key={info.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 cursor-pointer flex justify-center items-center backdrop-blur-lg bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 group"
            >
              <a href={info.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={info.img}
                  alt="social media icon"
                  width={24}
                  height={24}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
