"use client";

import { FormEvent, useRef, useState } from "react";
import {
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import styles from "@/styles/sections/ContactSection.module.css";

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const github = profile.socials.find((s) => s.label === "GitHub");
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");
  const emailSocial = profile.socials.find((s) => s.label === "Email");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Portfolio inquiry from ${name || "Visitor"}`,
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const year = new Date().getFullYear();

  return (
    <section className={styles.section} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{content.contact.eyebrow}</span>
          <h2 id="contact-title" className={styles.title}>
            {content.contact.title}
          </h2>
          <p className={styles.subtitle}>{content.contact.subtitle}</p>
          <span className={styles.accent}>{content.contact.ctaAccent}</span>
        </header>

        <form
          ref={formRef}
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className={styles.fieldGrid}>
            <div>
              <label htmlFor="contact-name" className={styles.label}>
                Name
              </label>
              <input
                id="contact-name"
                className={styles.input}
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={styles.label}>
                Email
              </label>
              <input
                id="contact-email"
                className={styles.input}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className={styles.fieldFull}>
              <label htmlFor="contact-message" className={styles.label}>
                Message
              </label>
              <textarea
                id="contact-message"
                className={styles.textarea}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your project…"
                required
              />
            </div>
          </div>

          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>
              Send Message
            </button>
            <a
              href={profile.resume}
              download
              className={styles.linkBtn}
            >
              <FaDownload size={14} />
              Download Resume
            </a>
          </div>
        </form>

        <div className={styles.links}>
          {linkedin && (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBtn}
            >
              <FaLinkedin size={14} />
              LinkedIn
            </a>
          )}
          {github && (
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBtn}
            >
              <FaGithub size={14} />
              GitHub
            </a>
          )}
          {emailSocial && (
            <a href={emailSocial.href} className={styles.linkBtn}>
              <FaEnvelope size={14} />
              Email
            </a>
          )}
        </div>

        <footer className={styles.footer}>
          <span className={styles.footerName}>{profile.name.full}</span>
          {" · "}
          {year} · {content.footer.rights}
        </footer>
      </div>
    </section>
  );
}
