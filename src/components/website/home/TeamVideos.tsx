"use client";

import { useState } from "react";
import { videos } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function TeamVideos() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <section className="team section">
      <SectionTitle className="team__title" mark="rumax-team-mark.svg" markClass="section-mark--team" title="The Rumax Team">
        <p>Our dedicated team of healthcare professionals committed to delivering exceptional care</p>
      </SectionTitle>
      <div className="container video-row">
        {videos.map((video, index) => {
          const isPlaying = playingIndex === index;
          return (
            <article className={`video-card ${video.size}${isPlaying ? " is-playing" : ""}`} key={video.thumb}>
              <AssetImage className="video-card__thumb" name={video.thumb} alt={video.alt} />
              <button type="button" aria-label={video.label} onClick={() => setPlayingIndex(index)}>
                <AssetImage name={video.playIcon} aria-hidden="true" />
              </button>
              <video className="video-card__player" controls preload="metadata" hidden={!isPlaying} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
