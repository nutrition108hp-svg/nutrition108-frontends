import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

export default function Reveal({ children, variants = fadeUp, className = "", delay = 0, amount = 0.25, ...rest }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
