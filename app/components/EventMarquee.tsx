"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const eventIcons = [
  "event1.svg",
  "event2.svg",
  "event3.svg",
  "event4.svg",
  "event5.svg",
  "event6.svg",
  "event7.svg",
  "event8.svg",
  "event9.svg",
  "event10.svg",
  "event11.svg",
  "event12.svg",
  "event13.svg",
  "event14.svg",
  "event15.svg",
  "event16.svg",
  "event17.svg",
  "event18.svg",
  "event19.svg",
  "event20.svg",
  "event21.svg",
  "event22.svg",
];

export default function EventMarquee() {
  // 配列を複製して連結することでシームレスなループを実現
  const icons = [...eventIcons, ...eventIcons];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex space-x-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {icons.map((icon, index) => (
          <Card key={index} className="p-2 flex-shrink-0">
            <div className="relative w-24 h-24">
              <Image
                src={`/${icon}`}
                alt={`Event ${index + 1}`}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
