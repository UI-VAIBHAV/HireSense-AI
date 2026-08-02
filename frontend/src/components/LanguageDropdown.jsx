import React from "react";
import { languages } from "../constants.js";

const LanguageDropdown = ({ langSetter, verSetter, socket, lang, roomId }) => {
  const handleChange = (event) => {
    const selectedLanguage = event.target.value;
    const selected = languages.find((l) => l.name === selectedLanguage);
    if (!selected) return;

    langSetter(selectedLanguage);
    verSetter(selected.version);
    socket?.emit("change-language", {
      room: roomId,
      data: { language: selectedLanguage, version: selected.version },
    });
  };

  return (
    <select
  className="bg-gray-800 border border-gray-700 text-white text-xs sm:text-sm font-bold uppercase px-3 py-2 rounded-lg outline-none cursor-pointer hover:bg-gray-700 transition-colors"
  value={lang}
  onChange={handleChange}
>
  {languages.map((l) => (
    <option key={l.name} value={l.name}>{l.name.toUpperCase()}</option>
  ))}
</select>
  );
};

export default LanguageDropdown;