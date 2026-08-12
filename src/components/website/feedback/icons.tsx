import React from "react";

type IconProps = {
  className?: string;
};

/**
 * Update these paths to match your actual filenames in public/images.
 * Since files live in /public, reference them from the root: "/images/filename.svg"
 * (Next.js / CRA / Vite all serve /public at the root URL.)
 */
export const ICON_PATHS = {
  sparkle: "/images/sparkle.svg",
  happy: "/images/happy.svg",
  neutral: "/images/neutral.svg",
  worried: "/images/worried.svg",
  frustrated: "/images/frustrated.svg",
  upset: "/images/upset.svg",
  message: "/images/message.svg",
  mic: "/images/microphone.svg",
  video: "/images/video.svg",
  upload: "/images/upload.svg",
  paperclip: "/images/paperclip.svg",
};

/* Generic icon renderer — just points <img> at the file in /public/images */
const Icon = ({
  src,
  className,
  alt = "",
}: {
  src: string;
  className?: string;
  alt?: string;
}) => <img src={src} className={className} alt={alt} />;

export const SparkleIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.sparkle} className={className} alt="" />
);

export const HappyIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.happy} className={className} alt="Happy" />
);

export const NeutralIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.neutral} className={className} alt="Neutral" />
);

export const WorriedIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.worried} className={className} alt="Worried" />
);

export const FrustratedIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.frustrated} className={className} alt="Frustrated" />
);

export const UpsetIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.upset} className={className} alt="Upset" />
);

export const MessageIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.message} className={className} alt="" />
);

export const MicIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.mic} className={className} alt="" />
);

export const VideoIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.video} className={className} alt="" />
);

export const UploadIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.upload} className={className} alt="" />
);

export const PaperclipIcon = ({ className }: IconProps) => (
  <Icon src={ICON_PATHS.paperclip} className={className} alt="" />
);