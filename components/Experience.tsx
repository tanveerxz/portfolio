"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const realExperience = [
  {
    id: 1,
    company: "Scoofy",
    title: "Head of Frontend Development",
    period: "Feb 2025 - Present",
    type: "Leadership",
    location: "Remote",
    description:
      "Leading cross-functional teams to build and scale Scoofy’s AI-powered e-commerce platform using Next.js, TypeScript, and TailwindCSS.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "AI/LLM"],
    highlights: [
      "Led frontend architecture for AI commerce",
      "Collaborated with AI engineers for LLM integration",
      "Implemented scalable component-driven design",
    ],
  },
  {
    id: 2,
    company: "Kloak Ltd",
    title: "Frontend Developer",
    period: "Jul 2024 - Present",
    type: "Full-time",
    location: "London, UK",
    description:
      "Developing modern web applications using React ecosystem. Building responsive, performant user interfaces and integrating REST APIs.",
    technologies: ["React", "JavaScript", "CSS", "API Integration"],
    highlights: [
      "Building production-ready web applications",
      "Collaborating with backend teams on API integrations",
      "Improving UI responsiveness across devices",
    ],
  },
  {
    id: 3,
    company: "OrbitFind",
    title: "Founder & Lead Developer",
    period: "Aug 2024 - Sep 2024",
    type: "Startup",
    location: "Remote",
    description:
      "Founded and led a team of 4 developers to create a gamified event discovery platform with AI-driven recommendations.",
    technologies: ["React", "TypeScript", "Flask", "MySQL", "AWS"],
    highlights: [
      "Achieved 1.5K+ user activities in 2 months",
      "Integrated gamified achievement systems",
      "Built scalable architecture end-to-end",
    ],
  },
  {
    id: 4,
    company: "Headstarter AI",
    title: "Software Engineering Fellow",
    period: "Jul 2024 - Sep 2024",
    type: "Fellowship",
    location: "Remote + London Events",
    description:
      "Built 7 AI-powered projects using modern stacks, driving 5K+ engagements and 200+ user interactions.",
    technologies: ["Next.js", "Firebase", "RAG", "Pinecone", "AWS", "LLMs"],
    highlights: [
      "Collaborated with global developers",
      "Rapid prototyping & agile workflows",
      "Integrated advanced LLM-based features",
    ],
  },
  {
    id: 5,
    company: "Fam India",
    title: "Frontend Developer Intern",
    period: "Jul 2023 - Aug 2023",
    type: "Internship",
    location: "Remote",
    description:
      "Contributed to a fintech platform, creating responsive UI and understanding financial tech architecture.",
    technologies: ["HTML", "CSS", "JavaScript", "React"],
    highlights: [
      "First professional dev experience",
      "Worked with fintech engineers",
      "Learned scalable frontend practices",
    ],
  },
];

const Experience = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamically calculate how far you can drag
  useEffect(() => {
    const updateDragLimit = () => {
      if (!trackRef.current) return;
      const containerWidth = trackRef.current.parentElement?.offsetWidth || 0;
      const contentWidth = trackRef.current.scrollWidth;
      setMaxDrag(contentWidth - containerWidth);
    };

    updateDragLimit();
    window.addEventListener("resize", updateDragLimit);
    return () => window.removeEventListener("resize", updateDragLimit);
  }, []);

  // Scroll buttons move the same motion value
  const scroll = (direction: "left" | "right") => {
    const cardWidth = trackRef.current?.firstElementChild?.clientWidth || 400;
    const newX =
      direction === "left"
        ? Math.min(x.get() + cardWidth + 20, 0)
        : Math.max(x.get() - (cardWidth + 20), -maxDrag);

    animate(x, newX, { type: "spring", stiffness: 300, damping: 40 });

    setCurrentIndex((prev) =>
      direction === "left"
        ? Math.max(prev - 1, 0)
        : Math.min(prev + 1, realExperience.length - 1)
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Leadership":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Startup":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Fellowship":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "Full-time":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "Internship":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <section className="relative w-full py-20 overflow-hidden z-[60] isolate">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          My <span className="text-purple">Work Experience</span>
        </motion.h2>
        <p className="text-white/70 max-w-2xl mx-auto mt-4">
          Scroll or drag horizontally to explore my professional journey.
        </p>
      </div>

      {/* Slider controls */}
      <div className="flex justify-between items-center px-8 md:px-20 mb-6">
        <button
          onClick={() => scroll("left")}
          className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          <ChevronLeft className="text-white w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
        >
          <ChevronRight className="text-white w-5 h-5" />
        </button>
      </div>

      {/* Unified drag + button slider */}
      <div className="relative overflow-hidden px-10 md:px-20">
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.1}
          className="flex gap-8 cursor-grab active:cursor-grabbing"
        >
          {realExperience.map((exp) => (
            <motion.div
              key={exp.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-[85vw] sm:w-[65vw] md:w-[45vw] lg:w-[38vw]"
            >
              <div
                className="relative p-8 rounded-2xl border border-white/10 
                  bg-white/5 backdrop-blur-lg transition-all duration-500 
                  hover:border-purple/40 hover:shadow-[0_8px_30px_rgba(168,85,247,0.3)]"
              >
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getTypeColor(
                    exp.type
                  )}`}
                >
                  {exp.type}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {exp.title}
                </h3>
                <p className="text-purple font-semibold">{exp.company}</p>
                <div className="text-white/70 text-sm mt-1">
                  {exp.period} • {exp.location}
                </div>

                <p className="text-white/80 mt-4 leading-relaxed">
                  {exp.description}
                </p>

                <div className="mt-6 space-y-2">
                  {exp.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple mt-2"></div>
                      <span className="text-white/80">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/70 hover:bg-purple/10 hover:border-purple/30 transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-10">
        {realExperience.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-purple-400" : "w-3 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Experience;
