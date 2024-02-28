"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("d92799ef-44b2-4921-b3c4-9a0566da2518");
  }, []);

  return null;
};
