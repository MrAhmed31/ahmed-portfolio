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
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export default function SkillsSection() {
  return (
    <section className={styles.section} aria-labelledby="skills-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {content.skills.eyebrow}
          </motion.span>
          <motion.h2
            id="skills-title"
            className={styles.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            {content.skills.title}
          </motion.h2>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {content.skills.subtitle}
          </motion.p>
        </header>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {profile.skillGroups.map((group) => (
            <motion.article
              key={group.title}
              className={styles.group}
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <motion.ul
                className={styles.items}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.04 } },
                }}
              >
                {group.items.map((skill) => (
                  <motion.li
                    key={skill}
                    className={styles.item}
                    variants={chipVariants}
                    whileHover={{ x: 4, color: "var(--accent)" }}
                  >
                    <span className={styles.itemDot} aria-hidden />
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
