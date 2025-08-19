"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { testimonials } from "@/data";

const Clients = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  return (
    <section id="testimonials" className="py-16 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header with better messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <Star className="w-5 h-5 text-purple-400" />
            <span className="text-purple-200 font-medium">
              Client Success Stories
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              My Clients Don&apos;t Just
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Get Websites, They Get Results
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Real businesses. Real growth. Real ROI. See how I&apos;ve helped
            companies achieve measurable success with conversion-focused
            development.
          </p>
        </motion.div>

        {/* Main testimonial carousel - clean and focused */}
        <div className="relative mb-12">
          <div
            className="flex items-center justify-center gap-6"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Buttons with better styling */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-purple-200" />
            </motion.button>

            {/* Featured testimonial - clean design */}
            <div className="w-full max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative p-10 md:p-16 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-white/[0.18] shadow-2xl overflow-hidden">
                    {/* Subtle animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-blue-500/[0.03]" />

                    {/* Glass reflection effects */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-transparent to-transparent" />

                    {/* Premium badge */}
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-green-400 to-emerald-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      VERIFIED RESULTS
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-8 relative z-10">
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
                    </div>

                    {/* Testimonial text */}
                    <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-white mb-8 relative z-10">
                      <span className="text-3xl text-purple-400">&quot;</span>
                      {testimonials[activeIndex]?.quote ||
                        "Amazing work that transformed our business completely!"}
                      <span className="text-3xl text-purple-400">&quot;</span>
                    </blockquote>

                    {/* Enhanced Client info */}
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
                          <Star className="w-4 h-4 text-white fill-white" />
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
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span>Project completed 2024</span>
                        </div>
                      </div>
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

        {/* Quick testimonial grid - no overwhelming elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] hover:border-white/20 transition-all duration-300"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-white/80 text-sm mb-4 line-clamp-3">
                &quot;{testimonial.quote}&quot;
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.imgUrl}
                  alt={testimonial.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-white text-sm font-medium">
                    {testimonial.name}
                  </h5>
                  <p className="text-gray-400 text-xs">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Simple transition to next section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 cursor-pointer"
          onClick={() => {
            const formSection = document.getElementById("contact"); // footer id
            if (formSection) {
              formSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <div className="inline-flex items-center gap-2 text-gray-400">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm">Ready to join them?</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
