import BookTicketClient from "./BookTicketClient";

export default async function ShowPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div style={{ padding: 20 }}>
            <h1>Book Ticket</h1>
            <BookTicketClient showId={id} />
        </div>
    );
}
