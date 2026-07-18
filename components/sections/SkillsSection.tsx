"use client";

import { motion } from "framer-motion";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import styles from "@/styles/sections/SkillsSection.module.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function SkillsSection() {
  return (
    <section className={styles.section} aria-labelledby="skills-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>{content.skills.eyebrow}</span>
          <h2 id="skills-title" className={styles.title}>
            {content.skills.title}
          </h2>
          <p className={styles.subtitle}>{content.skills.subtitle}</p>
        </header>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {profile.skillGroups.map((group) => (
            <motion.article
              key={group.title}
              className={styles.group}
              variants={itemVariants}
            >
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <ul className={styles.items}>
                {group.items.map((skill) => (
                  <li key={skill} className={styles.item}>
                    <span className={styles.itemDot} aria-hidden />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
