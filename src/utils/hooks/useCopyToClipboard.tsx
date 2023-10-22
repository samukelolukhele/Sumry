import { useState } from "react";

const useCopyToClipboard = () => {
  const [copied, setCopied] = useState({
    status: false,
    text: "",
  });
  const handleCopyToClipboard = (textToCopy: string) => {
    setCopied({ status: true, text: textToCopy });
    navigator.clipboard.writeText(textToCopy);
    setTimeout(() => setCopied({ ...copied, status: false }), 3000);
  };

  return { copied, handleCopyToClipboard };
};

export default useCopyToClipboard;
