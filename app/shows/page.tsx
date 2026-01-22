import ShowCard from "../components/shows/ShowCard";

export default async function ShowsPage() {
    const res = await fetch("http://localhost:3000/api/shows", {
        cache: "no-store",
    });

    const data = await res.json();
    const shows = data.shows || [];

    return (
        <div className="bg-white text-black min-h-screen relative flex flex-col">
            <div className="bg-grain fixed inset-0 opacity-20 pointer-events-none z-50"></div>

            {/* Header Section - WHITE */}
            <div className="pt-40 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter text-black">
                        Upcoming <br className="md:hidden" /> <span className="text-transparent text-stroke md:text-black md:text-fill-inherit">Virtual Concert</span>
                    </h1>
                </div>
            </div>

            {/* List Section - YELLOW */}
            <div className="bg-yellow-400 border-t-4 border-black flex-1 py-20 px-4">
                <div className="max-w-7xl mx-auto space-y-4">
                    {shows.length === 0 ? (
                        <div className="text-center py-20 border-4 border-dashed border-black">
                            <p className="text-2xl font-bold uppercase text-black">No shows scheduled right now.</p>
                        </div>
                    ) : (
                        shows.map((show: any) => (
                            <ShowCard key={show.id} show={show} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
