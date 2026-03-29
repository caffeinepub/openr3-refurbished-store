import { Mail, MapPin, Phone } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

export function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !name || !email || !message) return;
    setSending(true);
    try {
      await actor.submitFeedback(name, email, message);
      toast.success("Thank you! Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="bg-[#1E1B4B] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <img
            src="/assets/uploads/openr3_logo-019d3980-c9b5-76dc-ab8f-78ec4c9fe7e9-1.png"
            alt="OPEN R3"
            className="h-12 w-auto mb-4 brightness-0 invert"
          />
          <p className="text-[#A5B4FC] text-sm leading-relaxed">
            Premium certified refurbished electronics. Quality you trust, at a
            price you love.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[#C7D2FE]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#7C3AED]" />
              <span>
                Mangal Bhawan, Power House Colony 6th Lane, Jeypore, 764001
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-[#7C3AED]" />
              <a
                href="mailto:openr3.in@gmail.com"
                className="hover:text-white transition-colors"
              >
                openr3.in@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-[#7C3AED]" />
              <a
                href="tel:8917656405"
                className="hover:text-white transition-colors"
              >
                +91 8917656405
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">Shop</h3>
          <div className="flex flex-col gap-2">
            {["home", "mobiles", "tablets", "laptops", "compare"].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => onNavigate(p)}
                className="text-[#A5B4FC] hover:text-white text-sm text-left capitalize transition-colors"
              >
                {p === "home" ? "Home" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-white">
            Send Us a Message
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-[#A5B4FC] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-[#A5B4FC] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your Message"
              required
              rows={3}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-[#A5B4FC] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-gradient-to-r from-[#7C3AED] to-[#4C1D95] text-white font-semibold py-2 rounded-lg hover:from-[#6D28D9] hover:to-[#3B0764] transition-all disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[#A5B4FC] text-xs">
        © 2024 OPEN R3. All rights reserved. | Revive • Restore • Reboot
      </div>
    </footer>
  );
}
