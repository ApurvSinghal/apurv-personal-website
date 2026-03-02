"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(result?.error || "Failed to send message. Please try again.");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 scroll-mt-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Contact
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {"Let's work together"}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {"I'm currently open to new opportunities and interesting projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!"}
          </p>

          {/* Email Link */}
          <a
            href="mailto:apurv.singhal28@gmail.com"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-12"
          >
            <Mail size={20} />
            apurv.singhal28@gmail.com
          </a>

          {/* Contact Form */}
          {submitted ? (
            <div className="p-6 bg-card rounded-lg border border-border">
              <p className="text-foreground font-medium">
                Thanks for reaching out!
              </p>
              <p className="text-muted-foreground mt-2">
                {"I'll get back to you as soon as possible."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-card border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="bg-card border-border focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="bg-card border-border focus:border-primary resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send size={16} className="ml-2" />
                  </>
                )}
              </Button>
              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
