/**
 * Web Speech API and Audio helpers for IELTS & TOEFL Speaking and Listening
 */

// Speech Synthesis
export function speakText(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    voiceName?: string;
    lang?: string;
    onEnd?: () => void;
  }
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options?.rate ?? 1.0;
  utterance.pitch = options?.pitch ?? 1.0;
  utterance.lang = options?.lang ?? "en-US";

  const voices = window.speechSynthesis.getVoices();
  if (options?.voiceName && voices.length > 0) {
    const selectedVoice = voices.find(
      (v) => v.name.includes(options.voiceName!) || v.lang.includes(options.lang || "en")
    );
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Browser Speech Recognition for Speaking Practice
export function createSpeechRecognizer(callbacks: {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: any) => void;
  onEnd: () => void;
}) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
    let interim = "";
    let final = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript + " ";
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    callbacks.onResult((final || interim).trim(), Boolean(final));
  };

  recognition.onerror = (event: any) => {
    callbacks.onError(event.error);
  };

  recognition.onend = () => {
    callbacks.onEnd();
  };

  return recognition;
}
