import emailjs from '@emailjs/browser';
import { useContext, useState, useRef, useEffect } from "react";
import axios from 'axios';
import API_URL from '../../config'

import { motion } from "framer-motion";
import { FaLinkedin, FaPhoneAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { Send, MessageSquare, Mail, User, Clock, MapPin } from "lucide-react";

const Contact = () => {
    const isDark = true;
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [contactInfo, setContactInfo] = useState(null);
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/contact`);
                setContactInfo(res.data);
            } catch (error) {
                console.error("Error fetching contact info:", error);
            }
        };
        fetchContact();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("Sending...");

        emailjs.send(
            "service_4cvf04q",
            "template_3lt9puk",
            formData,
            "loPRsNWVd_QjgnIG1"
        ).then(() => {
            setStatus("✅ Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
            setIsSubmitting(false);

            // Clear status after 5 seconds
            setTimeout(() => setStatus(""), 5000);
        }).catch(() => {
            setStatus("❌ Failed to send message. Please try again.");
            setIsSubmitting(false);
        });
    };

    return (
        <section
            id="contact"
            className={`relative min-h-screen py-24 px-6 md:px-12 lg:px-24 overflow-hidden transition-colors duration-500 bg-transparent ${isDark ? "text-white" : "text-gray-900"
                }`}
        >
            {/* Background is now handled globally */}

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md mb-6 ${isDark ? "bg-white/5 border-white/10 text-gray-300" : "bg-black/5 border-black/10 text-gray-600"
                            }`}
                    >
                        <MessageSquare size={14} />
                        <span className="text-xs font-semibold tracking-widest uppercase italic">Let's Connect</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-black tracking-tight mb-4 italic"
                    >
                        Get In <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? "from-cyan-400 to-blue-500" : "from-blue-600 to-green-600"}`}>Touch</span>
                    </motion.h2>

                    <motion.p
                        className={`max-w-2xl mx-auto text-base md:text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Have a project in mind or just want to say hi? I'd love to hear from you.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {contactInfo && [
                                {
                                    href: `tel:${contactInfo.phone}`,
                                    icon: <FaPhoneAlt size={18} />,
                                    title: "Phone",
                                    subtitle: contactInfo.phone,
                                    color: isDark ? "text-cyan-400 bg-cyan-500/10" : "text-cyan-600 bg-cyan-100"
                                },
                                {
                                    href: `mailto:${contactInfo.email}`,
                                    icon: <FaEnvelope size={18} />,
                                    title: "Email",
                                    subtitle: contactInfo.email,
                                    color: isDark ? "text-blue-400 bg-blue-500/10" : "text-blue-600 bg-blue-100"
                                },
                                {
                                    href: contactInfo.linkedin,
                                    icon: <FaLinkedin size={18} />,
                                    title: "LinkedIn",
                                    subtitle: "Connect on LinkedIn",
                                    color: isDark ? "text-blue-300 bg-blue-400/10" : "text-blue-700 bg-blue-100"
                                },
                                {
                                    href: `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`,
                                    icon: <FaWhatsapp size={18} />,
                                    title: "WhatsApp",
                                    subtitle: "Message on WhatsApp",
                                    color: isDark ? "text-green-400 bg-green-500/10" : "text-green-600 bg-green-100"
                                },
                                {
                                    href: "#",
                                    icon: <MapPin size={18} />,
                                    title: "Location",
                                    subtitle: contactInfo.address,
                                    color: isDark ? "text-orange-400 bg-orange-500/10" : "text-orange-600 bg-orange-100"
                                }
                            ].map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 ${isDark
                                        ? "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                                        : "bg-white border-gray-100 hover:shadow-lg hover:shadow-gray-200"
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl w-fit mb-3 ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{item.title}</h4>
                                    <p className="font-bold text-sm md:text-base truncate">{item.subtitle}</p>
                                </a>
                            ))}
                        </div>

                        {/* Response Time */}
                        <div className={`p-6 rounded-2xl border ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-100"}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${isDark ? "bg-purple-500/10 text-purple-400" : "bg-purple-100 text-purple-600"}`}>
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base md:text-lg">Quick Response</h4>
                                    <p className={`text-xs md:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>I try to respond to all messages within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className={`p-8 rounded-3xl border shadow-2xl ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
                                }`}
                        >
                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`} htmlFor="name">
                                        Your Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${isDark
                                                ? "bg-black/20 border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                }`}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`} htmlFor="email">
                                        Your Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={16} />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm outline-none transition-all ${isDark
                                                ? "bg-black/20 border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                                : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                }`}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`} htmlFor="message">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`w-full p-4 rounded-xl border text-sm outline-none transition-all ${isDark
                                            ? "bg-black/20 border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                            : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            }`}
                                        placeholder="Tell me about your project..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all uppercase tracking-widest ${isDark
                                        ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                                        } disabled:opacity-70`}
                                >
                                    {isSubmitting ? (
                                        <span>Sending...</span>
                                    ) : (
                                        <>
                                            Send Message <Send size={16} />
                                        </>
                                    )}
                                </button>

                                {status && (
                                    <p className={`text-center text-sm font-medium ${status.includes("✅") ? "text-green-500" : "text-red-500"}`}>
                                        {status}
                                    </p>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
