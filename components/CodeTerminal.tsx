"use client";

type Line = { tokens: { text: string; c?: string }[] };

const lines: Line[] = [
  { tokens: [{ text: "def", c: "kw" }, { text: " authenticate(" }, { text: "frame", c: "arg" }, { text: "):" }] },
  { tokens: [{ text: "    face", c: "var" }, { text: " = " }, { text: "mtcnn.detect", c: "fn" }, { text: "(frame)" }] },
  { tokens: [{ text: "    embedding", c: "var" }, { text: " = " }, { text: "facenet.encode", c: "fn" }, { text: "(face)" }] },
  { tokens: [{ text: "" }] },
  { tokens: [{ text: "    " }, { text: "# no raw biometric data is ever stored", c: "cm" }] },
  { tokens: [{ text: "    passenger_id", c: "var" }, { text: " = " }, { text: "sha256_hash", c: "fn" }, { text: "(embedding)" }] },
  { tokens: [{ text: "" }] },
  { tokens: [{ text: "    match", c: "var" }, { text: " = " }, { text: "vault.lookup", c: "fn" }, { text: "(passenger_id)" }] },
  { tokens: [{ text: "    if", c: "kw" }, { text: " match" }, { text: ".confidence", c: "" }, { text: " > " }, { text: "0.92", c: "num" }, { text: ":" }] },
  { tokens: [{ text: "        " }, { text: "deduct_fare", c: "fn" }, { text: "(match.account)" }] },
  { tokens: [{ text: "        " }, { text: "return", c: "kw" }, { text: " " }, { text: "\"authenticated\"", c: "str" }] },
];

function colorFor(c?: string) {
  switch (c) {
    case "kw":
      return "text-[#F0A6E8]";
    case "fn":
      return "text-[var(--accent-cyan)]";
    case "var":
      return "text-[var(--accent-teal)]";
    case "str":
      return "text-[var(--accent-amber)]";
    case "num":
      return "text-[var(--accent-amber)]";
    case "cm":
      return "text-[var(--text-faint)] italic";
    default:
      return "text-[var(--text-primary)]";
  }
}

export default function CodeTerminal() {
  return (
    <div className="glass overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-[var(--border-hair)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
        <span className="font-mono ml-3 text-xs text-[var(--text-faint)]">
          facefare/auth.py
        </span>
      </div>
      <pre className="font-mono overflow-x-auto px-5 py-5 text-[13px] leading-[1.85] sm:text-sm">
        <code>
          {lines.map((line, i) => (
            <div key={i}>
              {line.tokens.map((t, j) => (
                <span key={j} className={colorFor(t.c)}>
                  {t.text}
                </span>
              ))}
              {line.tokens.length === 0 || (line.tokens.length === 1 && line.tokens[0].text === "") ? "\u00A0" : null}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
