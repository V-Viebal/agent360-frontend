import React from "react";
import { MessageSquare, Mic } from "lucide-react";

export interface ChannelChatIconProps {
  channel?: string;
  isSelected?: boolean;
  size?: number;
  activeColor?: string;
  className?: string;
}

export function ChannelChatIcon({
  channel,
  isSelected,
  size = 15,
  activeColor,
  className = "",
}: ChannelChatIconProps) {
  const ch = (channel || "console").toLowerCase().trim();

  // 1. Official Slack Logo (Official 2019 Brand Vector: 4 octagons + 4 teardrops)
  if (ch === "slack") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Slack"
      >
        <path d="M26.8925 80.886C26.8925 88.2866 20.8469 94.3323 13.4463 94.3323C6.04561 94.3323 0 88.2866 0 80.886C0 73.4853 6.04561 67.4397 13.4463 67.4397H26.8925V80.886Z" fill="#E01E5A"/>
        <path d="M33.6675 80.886C33.6675 73.4853 39.7131 67.4397 47.1137 67.4397C54.5144 67.4397 60.56 73.4853 60.56 80.886V114.554C60.56 121.954 54.5144 128 47.1137 128C39.7131 128 33.6675 121.954 33.6675 114.554V80.886Z" fill="#E01E5A"/>
        <path d="M47.1137 26.8925C39.7131 26.8925 33.6675 20.8469 33.6675 13.4463C33.6675 6.0456 39.7131 0 47.1137 0C54.5144 0 60.56 6.0456 60.56 13.4463V26.8925H47.1137Z" fill="#36C5F0"/>
        <path d="M47.114 33.6678C54.5147 33.6678 60.5603 39.7134 60.5603 47.114C60.5603 54.5147 54.5147 60.5603 47.114 60.5603H13.4463C6.0456 60.5603 0 54.5147 0 47.114C0 39.7134 6.0456 33.6678 13.4463 33.6678H47.114Z" fill="#36C5F0"/>
        <path d="M101.107 47.114C101.107 39.7134 107.153 33.6678 114.554 33.6678C121.954 33.6678 128 39.7134 128 47.114C128 54.5147 121.954 60.5603 114.554 60.5603H101.107V47.114Z" fill="#2EB67D"/>
        <path d="M94.3322 47.114C94.3322 54.5147 88.2866 60.5603 80.8859 60.5603C73.4853 60.5603 67.4397 54.5147 67.4397 47.114V13.4463C67.4397 6.0456 73.4853 0 80.8859 0C88.2866 0 94.3322 6.0456 94.3322 13.4463V47.114Z" fill="#2EB67D"/>
        <path d="M80.8859 101.107C88.2866 101.107 94.3322 107.153 94.3322 114.554C94.3322 121.954 88.2866 128 80.8859 128C73.4853 128 67.4397 121.954 67.4397 114.554V101.107H80.8859Z" fill="#ECB22E"/>
        <path d="M80.8859 94.3323C73.4853 94.3323 67.4397 88.2866 67.4397 80.886C67.4397 73.4853 73.4853 67.4397 80.8859 67.4397H114.554C121.954 67.4397 128 73.4853 128 80.886C128 88.2866 121.954 94.3323 114.554 94.3323H80.8859Z" fill="#ECB22E"/>
      </svg>
    );
  }

  // 2. Official Telegram Logo (Gradient Circle + Authentic 3D Paper Airplane)
  if (ch === "telegram") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Telegram"
      >
        <defs>
          <linearGradient id="tg-real-grad" x1="120" y1="240" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1F94D2"/>
            <stop offset="1" stopColor="#37AEE2"/>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="120" fill="url(#tg-real-grad)"/>
        <path d="M81.23 128.77l14.24 39.41s1.78 3.68 3.68 3.68 30.26-29.49 30.26-29.49l31.52-60.89-79.7 47.29z" fill="#C8DAEA"/>
        <path d="M100.11 138.88l-2.43 35.79c1.94 0 3.75-.85 4.86-2.28l17.78-17.1-20.21-16.41z" fill="#A9C9DD"/>
        <path d="M183.08 63.86L158.47 180.06c-1.86 8.2-6.7 10.24-13.58 6.42l-37.44-27.6-18.06 17.38c-2 2-3.68 3.68-7.56 3.68l2.68-37.96 69.1-62.44c3-2.66-.66-4.14-4.66-1.46L63.51 131.82 26.75 120.32c-8-2.5-8.14-8 1.66-11.84L172.09 53.12c6.66-2.48 12.46 1.52 11 10.74z" fill="white"/>
      </svg>
    );
  }

  // 3. Official Zalo Logo (Official Blue Squircle + White Speech Bubble + Zalo Wordmark)
  if (ch === "zalo") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Zalo"
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M22.782 0.166H27.199C33.265 0.166 36.81 1.057 39.957 2.744C43.104 4.431 45.588 6.896 47.256 10.043C48.943 13.19 49.834 16.735 49.834 22.801V27.199C49.834 33.265 48.943 36.81 47.256 39.957C45.569 43.104 43.104 45.588 39.957 47.256C36.81 48.943 33.265 49.834 27.199 49.834H22.801C16.735 49.834 13.19 48.943 10.043 47.256C6.896 45.569 4.412 43.104 2.744 39.957C1.057 36.81 0.166 33.265 0.166 27.199V22.801C0.166 16.735 1.057 13.19 2.744 10.043C4.431 6.896 6.896 4.412 10.043 2.744C13.171 1.057 16.735 0.166 22.782 0.166Z" fill="#0068FF"/>
        <path opacity="0.12" fillRule="evenodd" clipRule="evenodd" d="M49.834 26.474v.725c0 6.066-.891 9.611-2.578 12.758-1.687 3.147-4.152 5.63-7.299 7.299-3.147 1.687-6.692 2.578-12.758 2.578h-4.398c-4.964 0-8.24-.597-10.99-1.738l-4.535-4.67 42.558-16.952z" fill="#001A33"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M7.779 43.589C10.102 43.846 13.006 43.184 15.068 42.183C24.023 47.132 38.02 46.895 46.492 41.473C46.821 40.98 47.128 40.468 47.413 39.936C49.106 36.778 50 33.22 50 27.132V22.718C50 16.629 49.106 13.071 47.413 9.913C45.739 6.754 43.246 4.281 40.088 2.588C36.929 0.894 33.371 0 27.283 0H22.85C17.664 0 14.298 0.653 11.47 1.899C11.315 2.037 11.164 2.178 11.015 2.321C2.717 10.32 2.087 27.659 9.123 37.078C9.131 37.092 9.139 37.106 9.149 37.12C10.233 38.719 9.187 41.515 7.551 43.152C7.284 43.399 7.379 43.551 7.779 43.589Z" fill="white"/>
        <path d="M20.563 17H10.838v2.085h6.749L10.933 27.332c-.209.303-.36.587-.36 1.232v.531h9.175c.455 0 .834-.379.834-.834V27.142h-7.09l6.256-7.848c.095-.114.265-.322.341-.417l.038-.057c.36-.531.436-.986.436-1.536V17z" fill="#0068FF"/>
        <path d="M32.942 29.095h1.384V17h-2.085v11.393c0 .38.303.702.701.702z" fill="#0068FF"/>
        <path d="M25.814 19.692c-2.616 0-4.739 2.124-4.739 4.74 0 2.616 2.123 4.739 4.739 4.739s4.739-2.123 4.739-4.74c.019-2.615-2.104-4.739-4.739-4.739zm0 7.526c-1.535 0-2.787-1.251-2.787-2.786s1.252-2.787 2.787-2.787c1.535 0 2.786 1.251 2.786 2.787 0 1.535-1.232 2.786-2.786 2.786z" fill="#0068FF"/>
        <path d="M40.487 19.616c-2.635 0-4.777 2.142-4.777 4.777 0 2.635 2.142 4.778 4.777 4.778s4.777-2.143 4.777-4.778c0-2.635-2.142-4.777-4.777-4.777zm0 7.602c-1.554 0-2.806-1.251-2.806-2.806 0-1.554 1.252-2.805 2.806-2.805 1.554 0 2.805 1.251 2.805 2.805 0 1.555-1.251 2.806-2.805 2.806z" fill="#0068FF"/>
        <path d="M29.456 29.094h1.119V19.957h-1.953v8.322c0 .436.379.815.834.815z" fill="#0068FF"/>
      </svg>
    );
  }

  // 4. Official Discord Logo (Official Clyde Mascot on Blurple Squircle)
  if (ch === "discord") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Discord"
      >
        <rect width="24" height="24" rx="5.5" fill="#5865F2"/>
        <path d="M19.73 5.37A19.79 19.79 0 0 0 14.85 3.85a.07.07 0 0 0-.08.04c-.21.38-.45.86-.61 1.25a18.27 18.27 0 0 0-5.49 0c-.16-.39-.41-.87-.62-1.25a.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 10.05-.32 14.58.1 19.06a.08.08 0 0 0 .03.06c2.05 1.51 4.04 2.42 5.99 3.03a.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-1.99a.08.08 0 0 0-.04-.11c-.65-.25-1.27-.55-1.87-.89a.08.08 0 0 1-.01-.13c.12-.1.25-.19.37-.29a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08.01c.12.1.25.2.37.29a.08.08 0 0 1-.01.13c-.6.34-1.22.64-1.87.89a.08.08 0 0 0-.04.11c.36.7.77 1.36 1.23 1.99a.08.08 0 0 0 .08.03c1.96-.61 3.95-1.52 6-3.03a.08.08 0 0 0 .03-.06c.5-5.18-.84-9.67-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.33-.95 2.42-2.16 2.42z" fill="white"/>
      </svg>
    );
  }

  // 5. Official Microsoft Teams Logo (Microsoft multi-plane 3D brand logo)
  if (ch === "teams" || ch === "msteams" || ch === "microsoft teams") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 2229 2074"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Microsoft Teams"
      >
        <path fill="#5059C9" d="M1554.6 777.5h575.7c54.4 0 98.5 44.1 98.5 98.5v524.4c0 199.9-162.1 362-362 362h-1.7c-199.9 0-362-162-362-361.9V829c-38.5-28.4-15.5-51.5 51.5-51.5z"/>
        <circle fill="#5059C9" cx="1943.8" cy="440.6" r="233.3"/>
        <circle fill="#7B83EB" cx="1218.1" cy="336.9" r="336.9"/>
        <path fill="#7B83EB" d="M1667.3 777.5H717c-53.7 1.3-96.3 45.9-95 99.7v598.1c-7.5 322.5 247.7 590.2 570.2 598.1 322.5-7.9 577.7-275.5 570.2-598.1V877.2c7.4-53.7-35.1-98.3-88.8-99.7z"/>
        <path fill="#464EB8" d="M95 466.5h950.3c52.5 0 95 42.5 95 95v950.3c0 52.5-42.5 95-95 95H95c-52.5 0-95-42.5-95-95V561.5c0-52.5 42.5-95 95-95z"/>
        <path fill="#FFF" d="M820.2 828.2H630.2v517.3H509.2V828.2H320.1V727.8h500.1v100.4z"/>
      </svg>
    );
  }

  // 6. Official WhatsApp Logo (Green Circle + Speech Bubble + Handset)
  if (ch === "whatsapp") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 176 176"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="WhatsApp"
      >
        <circle cx="88" cy="88" r="88" fill="#25D366"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M88 30C56 30 30 56 30 88c0 10.3 2.7 20 7.4 28.5L32 144l28.2-5.4C68.4 143.3 77.9 146 88 146c32 0 58-26 58-58s-26-58-58-58zm29.8 82.3c-1.3 3.6-7.3 6.9-10.2 7.3-2.6.4-5.9.6-9.6-.6-2.2-.7-5.1-1.7-8.8-3.3-15.6-6.8-25.7-22.5-26.5-23.5-.8-1-6.4-8.5-6.4-16.2 0-7.7 4-11.4 5.5-13 1.5-1.5 3.2-1.9 4.3-1.9 1 0 2 .03 2.9.06 1 .05 2.3-.37 3.6 2.7 1.3 3.1 4.4 10.7 4.8 11.5.4.8.6 1.7.1 2.8-.5 1-1.1 1.7-1.8 2.6-.8 1-1.6 2-2.3 2.7-.8.8-1.6 1.7-.7 3.3.9 1.5 4 6.6 8.6 10.7 6 5.3 11 7 12.5 7.8 1.5.8 2.5.6 3.4-.4 1-1 4-4.5 5-6 1-1.5 2.1-1.3 3.5-.8 1.4.5 9 4.3 10.5 5 1.5.8 2.5 1.2 2.9 1.8.4.8.4 3.8-.9 7.4z" fill="white"/>
      </svg>
    );
  }

  // 7. Official Feishu / Lark Logo (ByteDance Origami Bird)
  if (ch === "feishu" || ch === "lark") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 145 145"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Feishu"
      >
        <path d="M12.4 87.8c14.2 5.5 34.5 1.8 52.3-13.8L21.5 55.2c-4.8 4.8-7.8 11.4-9 18.6 0 5.4 1.8 10.8-.1 14z" fill="#00D6B9"/>
        <path d="M73.8 74.1c21-18.6 37.8-45 43.2-62.4-17.4 5.4-43.8 22.2-62.4 43.2l19.2 19.2z" fill="#3370FF"/>
        <path d="M54 54.2c-13.2 13.2-26.4 30.6-31.8 48 17.4-5.4 34.8-18.6 48-31.8L54 54.2z" fill="#245BDB"/>
      </svg>
    );
  }

  // 8. Official DingTalk Logo (Alibaba Wing on Blue Squircle)
  if (ch === "dingtalk") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="DingTalk"
      >
        <rect width="24" height="24" rx="5.5" fill="#0089FF"/>
        <path d="M6.5 8.2c1.7-1.4 4-2.1 6.5-1.9.2 0 .4.1.5.2l.2.3c-.1.3-.3.6-.6.9-1.7 1.7-3.8 2.9-6.2 3.5-.3.1-.6-.2-.6-.5.1-.8.1-1.7.2-2.5zm2.2 3.4c2.7-.5 5.2-1.8 7.2-3.8l.4-.4c.3-.3.7-.1.7.3 0 1.1-.2 2.3-.6 3.3-.7 1.6-2 3-3.6 3.9l-2.2 1.3c-.3.2-.6-.1-.5-.4.4-1.4.6-2.8.6-4.2zm6-1c.8-.6 1.6-1.4 2.1-2.3.2-.3.5-.3.7 0 .4.7.6 1.5.7 2.4 0 .4-.3.6-.7.7-.9.3-1.9.4-2.9.4-.4 0-.6-.4-.3-.6.1-.2.2-.4.4-.6zM7.7 14.7l1.5-.8c.3-.2.6.1.5.4-.3 1-.8 2-1.5 2.8-.3.3-.7.2-.8-.2-.1-.7.1-1.4.3-2.2z" fill="white"/>
      </svg>
    );
  }

  // 9. Official Matrix Logo
  if (ch === "matrix") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Matrix"
      >
        <path d="M27.1 31.2v-30.5h-2.19v-.73h3.04v32h-3.04v-.77h2.19zM.8 31.2V.7h2.19V-.03H-.05v32h3.04v-.77H.8zM7.3 10.3h1.8v1.1c.4-.7 1.2-1.3 2.3-1.3.8 0 1.5.3 2 .8.5.5.8 1.3.8 2.2v8.4h-1.8v-8c0-.6-.1-1-.4-1.3-.3-.3-.7-.4-1.2-.4-.5 0-1 .2-1.3.5-.3.4-.5.9-.5 1.5v7.7H7.3v-11.2z" fill="#0DBD8B"/>
      </svg>
    );
  }

    // 10. Voice Call / Audio Channel
  if (ch === "voice" || ch === "call" || ch === "audio") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Voice Channel"
      >
        <rect width="24" height="24" rx="5.5" fill="#8B5CF6"/>
        <path d="M12 14c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v5c0 1.66 1.34 3 3 3z" fill="white"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="white"/>
      </svg>
    );
  }

  // Default: Console / Web Workspace
  return (
    <MessageSquare
      size={size}
      style={isSelected && activeColor ? { color: activeColor } : undefined}
      className={`${isSelected ? (!activeColor ? "text-[var(--agent-light)] dark:text-[var(--agent-dark)]" : "") : "text-neutral-400"} ${className}`}
    />
  );
}
