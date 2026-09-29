import RenderDashboard from "./RenderDashboard";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";
import { env } from "@/env";
import { type Audio } from "./types/audio.type";

const fetchAudioReleases = async (userId: string | undefined) => {
  if (!userId) return [];
  try {
    const userAudioReleases = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_URL}/api/audio/${userId}`,
      { cache: "no-store" }
    );
    if (!userAudioReleases.ok) return [];
    const userAudioReleasesData = (await userAudioReleases.json()) as Audio[];
    return userAudioReleasesData ?? [];
  } catch (e) {
    return [];
  }
};

const Dashboard = async () => {
  let userSubscription = null;
  try {
    userSubscription = await api.subscriptions.getSubscription();
  } catch (e) {
    // Fallback if db is unavailable
  }

  let session = null;
  try {
    session = await getServerAuthSession();
  } catch (e) {
    // Fallback
  }

  const userId = session?.user?.id;
  const userAudioReleases = await fetchAudioReleases(userId);

  return (
    <>
      <RenderDashboard
        userSubscription={userSubscription}
        userAudioReleases={userAudioReleases}
      />
    </>
  );
};

export default Dashboard;
