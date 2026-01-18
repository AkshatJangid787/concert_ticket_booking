export default async function HomePage() {
  const res = await fetch("http://localhost:3000/api/shows", {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div style={{ padding: 20 }}>
      <h1>Upcoming Shows</h1>

      {data.shows.map((show: any) => (
        <div key={show.id} style={{ marginBottom: 20 }}>
          <h2>{show.title}</h2>
          <p>{show.description}</p>
          <p>
            {new Date(show.showDate).toLocaleString("en-IN")}
          </p>
          <p>₹{show.price}</p>
          <a href={`/shows/${show.id}`}>
            Book Ticket →
          </a>
        </div>
      ))}
    </div>
  );
}
