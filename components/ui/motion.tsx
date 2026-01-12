"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export const MotionCard = motion.create(Card)
export const MotionDiv = motion.div

export const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
}

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}
