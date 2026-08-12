import React from 'react';

import { Hero } from "@/components/website/home/Hero";
import { Services } from "@/components/website/home/Services";
import { Compliance } from '@/components/website/home/Compliance';
import { Trust } from '@/components/website/home/Trust';
import { Reviews } from '@/components/website/home/Reviews';
import { TeamVideos } from '@/components/website/home/TeamVideos';
import { CareCta } from '@/components/website/home/CareCta';
import { Locations } from '@/components/website/home/Locations';

function Home() {
  return (
    <div className="test">
      <Hero />
      <Services />
      <Compliance />
      <Trust />
      <Reviews />
      <TeamVideos />
      <CareCta />
      <Locations />
    </div>
  );
}

export default Home;