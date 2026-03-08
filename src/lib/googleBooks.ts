/**
 * Google Books API integration for auto-pulling book covers and metadata
 */

export interface BookResult {
  googleBooksId: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  publisher: string | null;
  publishedDate: string | null;
  description: string | null;
  pageCount: number | null;
  isbn: string | null;
}

/**
 * Search Google Books API
 */
export async function searchBooks(
  title: string,
  author?: string
): Promise<BookResult[]> {
  let query = title;
  if (author) query += `+inauthor:${author}`;

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`
    );
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.items) return [];

    return data.items.map((item: any) => {
      const vol = item.volumeInfo;
      const isbn = vol.industryIdentifiers?.find(
        (id: any) => id.type === "ISBN_13"
      )?.identifier || vol.industryIdentifiers?.[0]?.identifier || null;

      return {
        googleBooksId: item.id,
        title: vol.title,
        authors: vol.authors || [],
        coverUrl: vol.imageLinks?.thumbnail?.replace("http:", "https:") || null,
        publisher: vol.publisher || null,
        publishedDate: vol.publishedDate || null,
        description: vol.description || null,
        pageCount: vol.pageCount || null,
        isbn,
      };
    });
  } catch {
    return [];
  }
}
