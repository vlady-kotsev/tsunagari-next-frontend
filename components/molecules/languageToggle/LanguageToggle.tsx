"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "jp">("en");
  const router = useRouter();

  useEffect(() => {
    const cookieLang = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];

    if (cookieLang === "jp") {
      setLang("jp");
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === "en" ? "jp" : "en";
    document.cookie = `locale=${newLang}; path=/; max-age=31536000`;
    setLang(newLang);
    router.refresh();
  };

  return (
    <button
      className="text-primary text-2xl cursor-pointer"
      onClick={toggleLang}
    >
      {lang === "en" ? "日本語" : "EN"}
    </button>
  );
}
