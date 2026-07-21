"use client";

import { motion } from "framer-motion";
import { FormEvent, useCallback, useRef, useState } from "react";
import {
  FaArrowUp,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import { gsap } from "@/lib/gsap";
import styles from "@/styles/sections/ContactSection.module.css";

function getMainScroller() {
  return document.querySelector("main");
}

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

  const scrollToTop = useCallback(() => {
    const main = getMainScroller();
    if (!main) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    gsap.to(main, {
      scrollTop: 0,
      duration: 1,
      ease: "power2.inOut",
    });
  }, []);

  const year = new Date().getFullYear();

  const socialLinks = [
    linkedin && {
      key: "linkedin",
      href: linkedin.href,
      label: "LinkedIn",
      icon: FaLinkedin,
      external: true,
    },
    github && {
      key: "github",
      href: github.href,
      label: "GitHub",
      icon: FaGithub,
      external: true,
    },
    emailSocial && {
      key: "email",
      href: emailSocial.href,
      label: "Email",
      icon: FaEnvelope,
      external: false,
    },
  ].filter(Boolean) as {
    key: string;
    href: string;
    label: string;
    icon: typeof FaLinkedin;
    external: boolean;
  }[];

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

        <div className={styles.formWrap}>
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
              <motion.button
                type="submit"
                className={styles.submitBtn}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
              <motion.a
                href={profile.resume}
                download
                className={styles.linkBtn}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaDownload size={14} />
                Download Resume
              </motion.a>
            </div>
          </form>

          <div className={styles.links}>
            {socialLinks.map(({ key, href, label, icon: Icon, external }, i) => (
              <motion.a
                key={key}
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={styles.linkBtn}
                aria-label={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={14} />
                {label}
              </motion.a>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerTop}>
              <span className={styles.footerName}>{profile.name.full}</span>
              <div className={styles.footerSocials}>
                {socialLinks.map(({ key, href, label, icon: Icon, external }, i) => (
                  <motion.a
                    key={`footer-${key}`}
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={styles.socialIcon}
                    aria-label={label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    whileHover={{
                      y: -4,
                      scale: 1.08,
                      transition: { type: "spring", stiffness: 400 },
                    }}
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            <p className={styles.footerMeta}>
              © {year} {profile.name.full} · {content.footer.rights}
            </p>

            <motion.button
              type="button"
              className={styles.backToTop}
              onClick={scrollToTop}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Back to top"
            >
              <FaArrowUp size={12} />
              Back to top
            </motion.button>
          </div>
        </footer>
      </div>
    </section>
  );
}
