// RecentProjects.tsx
import { useState, useRef, useEffect } from "react";
import {
  FaLocationArrow,
  FaEye,
  FaRocket,
  FaSmile,
  FaCode,
  FaCoffee,
} from "react-icons/fa";
import { BsArrowUpRight, BsStars } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoMdTrendingUp } from "react-icons/io";
import { projects } from "@/data";

const RecentProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Only update if mouse is within the container
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          setTargetPosition({ x, y });
        }
      }
    };

    const handleMouseLeave = () => {
      // Fade out the effect when mouse leaves
      setTargetPosition({ x: -1000, y: -1000 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      setMousePosition((prev) => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.1,
        y: prev.y + (targetPosition.y - prev.y) * 0.1,
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetPosition]);

  return (
    <div
      id="projects"
      className="py-32 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Dynamic Background with Mouse Tracking */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)",
            left: `${mousePosition.x - 400}px`,
            top: `${mousePosition.y - 400}px`,
            filter: "blur(40px)",
            transform: "translate3d(0, 0, 0)",
            willChange: "left, top",
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Enhanced Header Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 backdrop-blur-sm mb-8">
            <BsStars className="text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-400">
              Featured Work
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>

          {/* Main Title with Advanced Animation */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-bold text-center">
              <span className="text-white">Recent</span>{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text bg-[length:200%_auto] animate-gradient">
                Projects
              </span>
            </h1>
          </div>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Crafting digital experiences with cutting-edge technology and
            creative design
          </p>

          {/* View Mode Toggle */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 border border-gray-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                </svg>
                Grid View
              </div>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800/70 border border-gray-700/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                List View
              </div>
            </button>
          </div>
        </div>

        {/* Projects Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Card Container */}
                <div className="relative h-full bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                  {/* Project Number Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                      <span className="text-xs font-mono text-purple-400">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-500/30">
                        <div className="flex items-center gap-1">
                          <IoMdTrendingUp className="text-yellow-400 text-xs" />
                          <span className="text-xs font-medium text-yellow-400">
                            Featured
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                        title="View Live Demo"
                      >
                        <FaEye className="text-white text-lg" />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                      {project.des}
                    </p>

                    {/* Tech Stack from Data */}
                    {(project as any).techStack && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(project as any).techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* CTA Button */}
                    {/* <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group/link"
                    >
                      <span className="font-medium">View Project</span>
                      <BsArrowUpRight className="transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                    </a> */}
                  </div>

                  {/* Animated Border - Fixed */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[-1]">
                    <div className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-border" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6 mb-20">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative"
                style={{
                  animation: `slideInFromLeft 0.6s ease-out ${
                    index * 0.1
                  }s both`,
                }}
              >
                <div className="relative flex flex-col md:flex-row gap-6 p-6 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10">
                  {/* Image */}
                  <div className="relative w-full md:w-64 h-48 md:h-40 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 max-w-2xl">{project.des}</p>
                      </div>
                      <div className="hidden md:block">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                        >
                          View Live
                          <FaLocationArrow className="text-sm" />
                        </a>
                      </div>
                    </div>

                    {/* Tech Stack from Data */}
                    {(project as any).techStack && (
                      <div className="flex flex-wrap gap-2">
                        {(project as any).techStack.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Mobile CTA */}
                    <div className="md:hidden mt-4">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                      >
                        <span className="font-medium">View Project</span>
                        <BsArrowUpRight />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { label: "Projects Completed", value: "50+", icon: FaRocket },
            { label: "Happy Clients", value: "30+", icon: FaSmile },
            { label: "Lines of Code", value: "100K+", icon: FaCode },
            { label: "Coffee Cups", value: "∞", icon: FaCoffee },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="p-6 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/50 text-center transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                  <Icon className="text-3xl text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-border {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-gradient-border {
          background-size: 200% 200%;
          animation: gradient-border 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default RecentProjects;
