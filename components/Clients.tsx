"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  Target,
  Zap,
  Calendar,
  Shield,
} from "lucide-react";
import { testimonials } from "@/data";
import Link from "next/link";

const Clients = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showUrgency, setShowUrgency] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(3);

  // Show urgency after user engagement
  useEffect(() => {
    const timer = setTimeout(() => setShowUrgency(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate spot scarcity
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => (prev > 1 ? prev - 1 : 3));
    }, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Conversion-focused stats (you can replace with real data)
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
      label: "Projects This Year",
      value: "47+",
      icon: CheckCircle,
      color: "text-purple-400",
    },
    {
      label: "Avg. Project ROI",
      value: "12x",
      icon: DollarSign,
      color: "text-yellow-400",
    },
  ];

  const trustSignals = [
    { icon: Award, text: "Top 1% Developer on Upwork" },
    { icon: Zap, text: "48hr Average Response Time" },
    { icon: Target, text: "100% Project Success Rate" },
    { icon: Shield, text: "NDA & IP Protection" },
  ];

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900/40 to-blue-900/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            animate={{
              y: [-100, 1000],
              x: [Math.random() * 1200, Math.random() * 1200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Urgency Banner */}
        <AnimatePresence>
          {showUrgency && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-8 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-3">
                <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
                <span className="text-orange-200 font-medium">
                  🔥 Only {spotsLeft} project spots left this month
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header with Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-purple-200 font-medium">
              Client Success Stories
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              My Clients Don't Just
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Get Websites, They Get Results
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
            Real businesses. Real growth. Real ROI. See how I've helped
            companies
            <span className="text-purple-400 font-semibold">
              {" "}
              3x their revenue{" "}
            </span>
            with conversion-focused development.
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {trustSignals.map((signal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <signal.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">{signal.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
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

        {/* Main Testimonial Display */}
        <div className="relative mb-16">
          <div
            className="flex items-center justify-center gap-8"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Buttons */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-purple-200" />
            </motion.button>

            {/* Featured Testimonial Card */}
            <div className="w-full max-w-5xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Enhanced Glassmorphic Card */}
                  <div className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-white/[0.18] shadow-2xl overflow-hidden">
                    {/* Subtle animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.03]" />

                    {/* Refined glass reflection effect */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-transparent to-transparent" />

                    {/* Premium badge */}
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-green-400 to-emerald-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      VERIFIED RESULTS
                    </div>

                    {/* Rating Stars with animation */}
                    {/* <div className="flex gap-1 mb-8 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                        </motion.div>
                      ))}
                      <span className="ml-2 text-yellow-400 font-semibold">
                        5.0
                      </span>
                    </div> */}

                    {/* Testimonial Text */}
                    <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-white mb-8 relative z-10">
                      {testimonials[activeIndex]?.quote ||
                        "Amazing work that transformed our business completely!"}
                    </blockquote>

                    {/* Enhanced Client Info */}
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-1">
                          <img
                            src={
                              testimonials[activeIndex]?.imgUrl ||
                              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                            }
                            alt={testimonials[activeIndex]?.name || "Client"}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        {/* Active indicator */}
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full border-3 border-white/30 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {testimonials[activeIndex]?.name || "Client Name"}
                        </h3>
                        <p className="text-purple-300 font-medium mb-2">
                          {testimonials[activeIndex]?.title ||
                            "Position, Company"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>Project completed 2025</span>
                        </div>
                      </div>

                      {/* Results metrics */}
                      {/* <div className="hidden md:flex flex-col gap-2">
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-center">
                          <div className="text-green-400 font-bold text-lg">
                            +247%
                          </div>
                          <div className="text-xs text-gray-300">
                            Conversion Rate
                          </div>
                        </div>
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2 text-center">
                          <div className="text-blue-400 font-bold text-lg">
                            $2.1M
                          </div>
                          <div className="text-xs text-gray-300">
                            Revenue Impact
                          </div>
                        </div>
                      </div> */}
                    </div>

                    {/* Floating decorative elements */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-500/[0.15] to-pink-500/[0.10] rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-blue-500/[0.10] to-cyan-500/[0.08] rounded-full blur-3xl" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="p-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-200" />
            </motion.button>
          </div>

          {/* Enhanced Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setActiveIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-gradient-to-r from-purple-400 to-blue-400 w-12"
                    : "bg-white/20 hover:bg-white/40 w-3"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Secondary Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.03 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-white/[0.01] backdrop-blur-xl border border-white/[0.12] hover:border-purple-500/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-white/90 mb-6 line-clamp-3 group-hover:text-white transition-colors italic">
                {testimonial.quote}
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.imgUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/30"
                />
                <div>
                  <h4 className="text-white font-semibold">
                    {testimonial.name}
                  </h4>
                  <p className="text-purple-300 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* High-Converting CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.01] backdrop-blur-2xl border border-white/[0.15] rounded-3xl p-12 max-w-4xl mx-auto overflow-hidden">
              {/* Subtle glass effects */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-transparent to-transparent" />
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-center mb-6"
              >
                <TrendingUp className="w-16 h-16 text-purple-400 mx-auto" />
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  3x Your Revenue
                </span>{" "}
                Too?
              </h3>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join 100+ successful businesses who've transformed their online
                presence.
                <span className="text-purple-400 font-semibold">
                  {" "}
                  Free strategy call included.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
                  onClick={() => {
                    const formSection = document.getElementById("contact"); // footer id
                    if (formSection) {
                      formSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Start My Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  onClick={() =>
                    window.open("https://calendly.com/tanveerxz", "_blank")
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 border-2 border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book Free Consultation
                </motion.button>
              </div>

              <div className="flex justify-center items-center gap-6 mt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>48hr Response Time</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
