"use client";

import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { content } from "@/data/content";
import { profile } from "@/data/profile";
import styles from "@/styles/sections/SkillsSection.module.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

export default function SkillsSection() {
  return (
    <Section
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <Heading
        eyebrow={content.skills.eyebrow}
        title={content.skills.title}
        subtitle={content.skills.subtitle}
        align="center"
        titleId="skills-title"
      />

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
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
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
                  whileHover={{ x: 4 }}
                >
                  <span className={styles.itemDot} aria-hidden />
                  {skill}
                </motion.li>
              ))}
            </motion.ul>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
