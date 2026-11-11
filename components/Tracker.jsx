"use client";

import { useEffect } from "react";
import { startTracking } from "@/lib/analytics/client";

// Mounted once in app/(site)/layout.jsx; renders nothing
const Tracker = () => {
  useEffect(() => startTracking(), []);
  return null;
};

export default Tracker;
