export default function get_indices(
  totalPages: number,
  pagesPerSection: number,
  currentPage: number
) {
  if (!totalPages) return [];

  const pages = [];

  if (totalPages <= pagesPerSection || currentPage < pagesPerSection) {
    for (let i = 0; i < pagesPerSection; i++) pages.push(i + 1);

    return pages;
  }

  const highestLow = totalPages - pagesPerSection;

  if (currentPage > highestLow + 1) {
    console.log(`here ${currentPage}`);
    for (let i = highestLow + 1; i <= totalPages; i++) pages.push(i);

    return pages;
  }

  const half = ~~(pagesPerSection / 2);

  for (let i = currentPage - half; i <= currentPage + half; i++) pages.push(i);
  return pages;
}
