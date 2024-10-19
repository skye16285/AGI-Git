import { Monaco } from "@monaco-editor/react";
import { monaco } from "react-monaco-editor";

export const registerAGIGit = (
  editor: monaco.editor.IStandaloneCodeEditor,
  monaco: Monaco,
) => {
  const gitCommand = "relay|push|pull";
  // 注册一个新的语言
  monaco.languages.register({ id: "AGIGit" });

  // 设置语言的规则
  monaco.languages.setMonarchTokensProvider("AGIGit", {
    tokenizer: {
      root: [
        [
          /^(AGIGit|agigit)(\s+)(relay|push|pull)(.*)$/,
          ["custom-green", "", "custom-green", ""],
        ],
        [
          /^(AGIGit|agigit)(\s+)(.*)(.*)$/,
          ["custom-green", "", "custom-error", ""],
        ],
        [
          /^(.*)(\s+)(relay|push|pull)(.*)$/,
          ["custom-error", "", "custom-green", ""],
        ],
        [/^(.*)(\s+)(.*)(.*)$/, ["custom-error", "", "custom-error", ""]],
        [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
      ],
    },
  });

  // 设置语言的主题
  monaco.editor.defineTheme("AGIGitTheme", {
    base: "vs",
    inherit: false,
    rules: [
      { token: "custom-green", foreground: "008000" },
      { token: "custom-info", foreground: "808080" },
      { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
    ],
    colors: {
      "editor.foreground": "#000000",
    },
  });

  monaco.editor.setTheme("AGIGitTheme");
};
