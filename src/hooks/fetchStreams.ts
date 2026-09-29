interface StreamData {
  id: string;
  name: string;
  streams: number;
}
export const fetchStreamsByAudioId = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return {};
    const response = await fetch(
      `${backendUrl}/api/all-streams/${userId}?timeRange=7days`,
    );

    if (!response.ok) {
      return {};
    }

    const streamData = (await response.json()) as Record<
      string,
      { date: string; total: number }[]
    >;

    return streamData;
  } catch (error) {
    console.warn("fetchStreamsByAudioId failed:", error);
    return {};
  }
};

export const fetchByAudioStreams = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return {};
    const response = await fetch(
      `${backendUrl}/api/streams/audio-streams/${userId}`,
    );

    if (!response.ok) {
      return {};
    }

    const streamData = (await response.json()) as Record<
      string,
      { title: string; totalStreams: number; cover: string }
    >;

    return streamData;
  } catch (error) {
    console.warn("fetchByAudioStreams failed:", error);
    return {};
  }
};

export const fetchAllStreamsCountry = async (userId: string | undefined) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl || !userId) return [];
    const response = await fetch(
      `${backendUrl}/api/streams/country/${userId}`,
    );

    if (!response.ok) {
      return [];
    }

    const streamData = (await response.json()) as StreamData[] | undefined;
    return streamData ?? [];
  } catch (error) {
    console.warn("fetchAllStreamsCountry failed:", error);
    return [];
  }
};
