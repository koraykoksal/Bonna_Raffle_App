export function standardizeDate(dateStr) {
    // Format 1: dd.MM.yyyy
    const dotFormat = /^\d{2}\.\d{2}\.\d{4}$/;
    if (dotFormat.test(dateStr)) {
        const [day, month, year] = dateStr.split(".");
        return `${year}-${month}-${day}`;
    }

    // Format 2: ISO format with time (e.g., 2024-05-26T18:00)
    const isoFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (isoFormat.test(dateStr)) {
        return dateStr.split("T")[0];
    }

    // Tanınmayan format: değişiklik yapmadan döndür
    return dateStr;
}