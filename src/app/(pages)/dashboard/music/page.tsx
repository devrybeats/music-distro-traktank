import { type Audio } from "../types/audio.type";
import { getServerAuthSession } from "@/server/auth";
import { type Metadata } from "next";
import RenderArtistMusic from "./RenderArtistMusic";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "My Music | We Plug Music - Dashboard",
  description:
    "My music upload page where I can upload my music and view my music releases.",
};

const fetchAudioReleases = async (userId: string | undefined) => {
  try {
    if (!env.NEXT_PUBLIC_BACKEND_URL || !userId) return [];
    const userAudioReleases = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/api/audio/${userId}`,
    );
    if (!userAudioReleases.ok) return [];
    const userAudioReleasesData = (await userAudioReleases.json()) as Audio[];
    return userAudioReleasesData;
  } catch (e) {
    return [];
  }
};

const MusicRelease = async () => {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  const userAudioReleases = await fetchAudioReleases(userId);

  return <RenderArtistMusic musicReleases={userAudioReleases} />;
};

export default MusicRelease;
