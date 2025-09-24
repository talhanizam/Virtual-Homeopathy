export default async function YouTubePage() {
	const apiKey = process.env.YOUTUBE_API_KEY;
	const channelId = process.env.YOUTUBE_CHANNEL_ID;

	let videos: { id: string; title: string; thumbnailUrl: string }[] = [];

	if (apiKey && channelId) {
		try {
			const url = new URL("https://www.googleapis.com/youtube/v3/search");
			url.searchParams.set("part", "snippet");
			url.searchParams.set("channelId", channelId);
			url.searchParams.set("order", "date");
			url.searchParams.set("maxResults", "9");
			url.searchParams.set("type", "video");
			url.searchParams.set("key", apiKey);

			const response = await fetch(url.toString(), { next: { revalidate: 1800 } });
			if (response.ok) {
				const data = await response.json();
				videos = (data.items || [])
					.filter((item: any) => item?.id?.videoId)
					.map((item: any) => ({
						id: item.id.videoId as string,
						title: item.snippet?.title as string,
						thumbnailUrl: item.snippet?.thumbnails?.medium?.url as string,
					}));
			}
		} catch (error) {
			// Swallow errors and fall back to empty list
		}
	}

	return (
		<main className="relative min-h-screen bg-white">
			<div className="relative mx-auto max-w-6xl px-6 pt-10 pb-20">
				<h1 className="text-3xl md:text-4xl font-bold text-[#111827]">Video Gallery</h1>
				<p className="text-[#374151] mt-2">Talks and tutorials by Dr. Reshma Nizam.</p>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{videos.length > 0 ? (
						videos.map((video) => (
							<div key={video.id} className="group relative rounded-3xl bg-white backdrop-blur ring-1 ring-[#E5E7EB] p-3 shadow-[0_20px_60px_rgba(17,24,39,0.06)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">
								<div className="relative z-10 aspect-video overflow-hidden rounded-2xl ring-1 ring-[#E5E7EB]">
									<iframe
										className="w-full h-full"
										src={`https://www.youtube.com/embed/${video.id}`}
										title={video.title || "YouTube video"}
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							</div>
						))
					) : (
						[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className="group relative rounded-3xl bg-white backdrop-blur ring-1 ring-[#E5E7EB] p-3 shadow-[0_20px_60px_rgba(17,24,39,0.06)] overflow-hidden">
								<div className="relative z-10 aspect-video overflow-hidden rounded-2xl ring-1 ring-[#E5E7EB] bg-[#F3F4F6]" />
							</div>
						))
					)}
				</div>
			</div>
		</main>
	);
}
