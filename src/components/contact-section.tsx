"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addBrowserPageAction, recordBrowserEvent, noticeBrowserError } from "@/lib/newrelic-browser";
import { Mail, Send, Check, Copy } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/constants";

function getEmailDomain(email: string) {
  const parts = email.toLowerCase().split("@");
  return parts.length === 2 ? parts[1] : "unknown";
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [copied, setCopied] = useState(false);
  const [formInteracted, setFormInteracted] = useState(false);
  const [formStartedAt] = useState(() => Date.now());
  const errorMessageId = "contact-submit-error";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      addBrowserPageAction("ContactEmailCopied", {
        contactMethod: "clipboard",
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      noticeBrowserError(
        error instanceof Error ? error : new Error("Clipboard write failed"),
        { stage: "copy_email_failed" },
      );
      recordBrowserEvent("ContactClientEvent", {
        errorMessage: error instanceof Error ? error.message : "Clipboard write failed",
        stage: "copy_email_failed",
      });
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    if (!formInteracted) {
      setFormInteracted(true);
      addBrowserPageAction("ContactFormInteractionStarted", {
        firstField: fieldName,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const submitStartedAt = performance.now();
    const emailDomain = getEmailDomain(formData.email);
    const messageLength = formData.message.length;

    addBrowserPageAction("ContactSubmitAttempted", {
      emailDomain,
      messageLength,
      pathname: window.location.pathname,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          formStartedAt,
        }),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(result?.error || "Failed to send message. Please try again.");
      }

      recordBrowserEvent("ContactClientEvent", {
        durationMs: Number((performance.now() - submitStartedAt).toFixed(2)),
        emailDomain,
        messageLength,
        responseStatus: response.status,
        stage: "submit_success",
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error("Unknown submit error");
      noticeBrowserError(errorObj, {
        stage: "submit_failed",
        emailDomain,
      });
      recordBrowserEvent("ContactClientEvent", {
        durationMs: Number((performance.now() - submitStartedAt).toFixed(2)),
        emailDomain,
        errorMessage:
          error instanceof Error ? error.message.slice(0, 500) : "Unknown submit error",
        messageLength,
        stage: "submit_failed",
      });

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
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-3">
            Contact
            <span className="text-xs font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 normal-case tracking-normal">
              press C
            </span>
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            {"Let's work together"}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {"I'm currently open to new opportunities and interesting projects. Whether you have a question or just want to say hi, I'll try my best to get back to you!"}
          </p>

          {/* Email Link */}
          <div className="inline-flex items-center gap-3 mb-12">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() =>
                addBrowserPageAction("ContactEmailClicked", {
                  contactMethod: "mailto",
                })
              }
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Mail size={20} />
              {CONTACT_EMAIL}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Copy email address"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {/* Contact Form */}
          {submitted ? (
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="p-6 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] backdrop-blur-md"
            >
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
                    onFocus={() => handleFieldFocus("name")}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    aria-describedby={submitError ? errorMessageId : undefined}
                    aria-invalid={submitError ? true : undefined}
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
                    onFocus={() => handleFieldFocus("email")}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    aria-describedby={submitError ? errorMessageId : undefined}
                    aria-invalid={submitError ? true : undefined}
                    required
                    className="bg-card border-border focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="sr-only">
                  Website
                </Label>
                <Input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  aria-hidden="true"
                  className="hidden"
                />
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
                  onFocus={() => handleFieldFocus("message")}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  aria-describedby={submitError ? errorMessageId : undefined}
                  aria-invalid={submitError ? true : undefined}
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
                <p
                  id={errorMessageId}
                  role="alert"
                  aria-live="assertive"
                  className="text-sm text-destructive"
                >
                  {submitError}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
