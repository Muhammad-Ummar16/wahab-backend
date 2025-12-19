import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Share2, PenTool, BarChart3 } from 'lucide-react';
import API_URL from '../../config';

const Skills = () => {
    const [skillCategories, setSkillCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const getIcon = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('social')) return <Share2 size={24} />;
        if (lowerTitle.includes('content') || lowerTitle.includes('design')) return <PenTool size={24} />;
        if (lowerTitle.includes('analytics') || lowerTitle.includes('tools')) return <BarChart3 size={24} />;
        return <Share2 size={24} />;
    };

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/skills`);
                setSkillCategories(res.data);
            } catch (error) {
                console.error("Error fetching skills:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);
    //this is testing
    if (loading) return null;

    return (
        <section id="skills" className="pt-32 pb-20 bg-transparent font-sans text-white min-h-screen">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-cyan-400 font-mono tracking-widest text-sm md:text-base uppercase">Expertise</h2>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black italic">Professional <span className="text-cyan-500 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Skills</span></h1>
                    <p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base">A comprehensive overview of my technical capabilities and professional strength in the digital landscape.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {skillCategories.map((category, idx) => (
                        <div key={idx} className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-cyan-500/30 transition-all group backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                                    {getIcon(category.title)}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold">{category.title}</h3>
                            </div>

                            <div className="space-y-6">
                                {category.skills.map((skill, sIdx) => (
                                    <div key={sIdx} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-300 font-medium">{skill.name}</span>
                                            <span className="text-cyan-400 font-mono">{skill.level}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-1000"
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Tools Section */}
                <div className="mt-20 p-8 md:p-10 bg-slate-900/40 border border-slate-800 rounded-3xl text-center backdrop-blur-sm">
                    <h3 className="text-xl md:text-2xl font-bold mb-8 italic">Soft Skills & Methodologies</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Agile Thinking', 'Problem Solving', 'Team Collaboration', 'Time Management', 'Growth Hacking', 'Crisis Management'].map((tag, tIdx) => (
                            <span key={tIdx} className="px-6 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm hover:border-cyan-500 hover:text-cyan-400 transition-colors cursor-default">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
