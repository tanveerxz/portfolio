"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const realExperience = [
  {
    id: 1,
    company: "Scoofy",
    title: "Head of Frontend Development",
    period: "Feb 2025 - Present",
    duration: "7+ months",
    type: "Leadership",
    location: "Remote",
    description:
      "Leading cross-functional teams to build and scale Scoofy&apos;s AI-powered e-commerce platform. Architecting frontend stack with Next.js, TypeScript, and TailwindCSS while collaborating with AI engineers to integrate LLM-powered shopping experiences.",
    achievements: [
      { metric: "AI Integration", value: "LLM-Powered" },
      { metric: "Team Lead", value: "Cross-functional" },
    ],
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "AI/LLM"],
    highlights: [
      "Leading frontend architecture for AI-powered platform",
      "Optimizing performance and user engagement",
      "Implementing scalable development practices",
    ],
  },
  {
    id: 2,
    company: "Kloak Ltd",
    title: "Frontend Developer",
    period: "Jul 2024 - Present",
    duration: "1+ year",
    type: "Full-time",
    location: "London, UK",
    description:
      "Developing modern web applications using React ecosystem. Building responsive, performant user interfaces and collaborating with backend teams on API integrations.",
    achievements: [
      { metric: "Duration", value: "1+ Year" },
      { metric: "Focus", value: "Modern Web" },
    ],
    technologies: ["React", "JavaScript", "CSS", "API Integration"],
    highlights: [
      "Building production-ready web applications",
      "Collaborating with development teams",
      "Implementing modern frontend practices",
    ],
  },
  {
    id: 3,
    company: "OrbitFind",
    title: "Founder & Lead Developer",
    period: "Aug 2024 - Sep 2024",
    duration: "2 months",
    type: "Startup",
    location: "Remote",
    description:
      "Founded and led a team of 4 developers to create an innovative event discovery platform with gamified elements and AI features. Built full-stack solution enabling event search, RSVP, hosting, and achievement systems.",
    achievements: [
      { metric: "User Activities", value: "1.5K+" },
      { metric: "Waitlist", value: "130+ Users" },
    ],
    technologies: ["React", "TypeScript", "Flask", "MySQL", "AWS", "Node.js"],
    highlights: [
      "Led team of 4 developers as founder",
      "Achieved 1.5K+ user activities in 2 months",
      "Built gamified platform with AI features",
    ],
  },
  {
    id: 4,
    company: "Headstarter AI",
    title: "Software Engineering Fellow",
    period: "Jul 2024 - Sep 2024",
    duration: "3 months",
    type: "Fellowship",
    location: "Remote + London Events",
    description:
      "Intensive fellowship building 7 AI-powered projects using modern tech stack. Collaborated with cross-functional teams using Agile methodologies and achieved significant user engagement across multiple platforms.",
    achievements: [
      { metric: "User Interactions", value: "200+" },
      { metric: "Social Engagement", value: "5K+" },
    ],
    technologies: ["Next.js", "Firebase", "RAG", "Pinecone", "AWS", "LLMs"],
    highlights: [
      "Built 7 AI-powered projects in 3 months",
      "200+ user interactions across platforms",
      "5K+ social media engagements generated",
    ],
  },
  {
    id: 5,
    company: "Fam India",
    title: "Frontend Developer Intern",
    period: "Jul 2023 - Aug 2023",
    duration: "2 months",
    type: "Internship",
    location: "Remote",
    description:
      "Gained valuable hands-on experience at a renowned fintech company. Worked on frontend development projects and learned industry best practices in financial technology.",
    achievements: [
      { metric: "Industry", value: "Fintech" },
      { metric: "Experience", value: "First Role" },
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React"],
    highlights: [
      "First professional development experience",
      "Worked in fintech industry environment",
      "Learned industry development standards",
    ],
  },
];

const Experience = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Show cards progressively
  useEffect(() => {
    realExperience.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => new Set([...prev, index]));
      }, index * 150);
    });
  }, []);

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
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <section className="py-20 w-full relative">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="heading">
            My <span className="text-purple">work experience</span>
          </h1>
          <p className="text-white-100 text-lg max-w-2xl mx-auto mt-6">
            From fintech intern to AI platform leader - here&apos;s my journey
            building real products that impact thousands of users.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Clean timeline line */}
          <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-purple/50 to-transparent" />

          <div className="space-y-16">
            {realExperience.map((exp, index) => {
              const isLeft = index % 2 === 0;
              const isVisible = visibleCards.has(index);

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30, y: 20 }}
                  animate={isVisible ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-start ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col md:gap-12`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 bg-purple rounded-full border-4 border-black-100 z-10 mt-6" />

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ml-12 md:ml-0`}>
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      onHoverStart={() => setActiveCard(index)}
                      onHoverEnd={() => setActiveCard(null)}
                      className="group cursor-pointer"
                    >
                      <div
                        className="relative p-8 rounded-2xl border border-white/[0.1] group-hover:border-purple/50 transition-all duration-500 overflow-hidden"
                        style={{
                          background: "rgb(4,7,29)",
                          backgroundColor:
                            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                        }}
                      >
                        {/* Type badge */}
                        <div
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getTypeColor(
                            exp.type
                          )}`}
                        >
                          {exp.type}
                        </div>

                        {/* Header */}
                        <div className="mb-6">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                            {exp.title}
                          </h3>
                          <p className="text-purple font-semibold text-lg mb-3">
                            {exp.company}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-white-100">
                            <span>{exp.period}</span>
                            <span>•</span>
                            <span>{exp.location}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-white-100 leading-relaxed mb-6 group-hover:text-white transition-colors">
                          {exp.description}
                        </p>

                        {/* Key achievements */}
                        <div className="mb-6">
                          <h4 className="text-white font-semibold mb-3 text-sm">
                            Key Impact:
                          </h4>
                          <div className="space-y-2">
                            {exp.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-purple rounded-full mt-2 flex-shrink-0" />
                                <span className="text-white-100 text-sm leading-relaxed">
                                  {highlight}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white-100 group-hover:bg-purple/10 group-hover:border-purple/30 transition-all duration-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          {exp.achievements.map((achievement, idx) => (
                            <div
                              key={idx}
                              className="text-center p-3 rounded-lg bg-white/5 group-hover:bg-purple/10 transition-colors"
                            >
                              <div className="text-purple font-bold text-sm">
                                {achievement.value}
                              </div>
                              <div className="text-white-100 text-xs">
                                {achievement.metric}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple/5 via-purple/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Simple bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-8 bg-black-100 border border-white/[0.1] rounded-2xl px-8 py-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple">5+</div>
              <div className="text-white-100 text-sm">Companies</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple">1.7K+</div>
              <div className="text-white-100 text-sm">Users Reached</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple">2+</div>
              <div className="text-white-100 text-sm">Years Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
