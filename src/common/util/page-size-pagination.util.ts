import { MetaPaginationInterface } from '../interfaces';

export class PageSizePaginationUtil {
  static preparePaginationParams(page: number, size: number): number {
    return (page - 1) * size;
  }

  static prepareMetaPage(count: number, page: number, size: number): MetaPaginationInterface {
    const total = count;
    const perPage = Number(size);

    let currentPage = Number(page);
    let countPage = 0;
    let nextPage = null as number | null;
    let previousPage = null as number | null;
    let from = ((page - 1) * size + 1) as number | null;
    let to = (page * size) as number | null;

    if (to) {
      if (to > count) to = count;
      if (to < total) nextPage = currentPage + 1;
    }
    if (from) {
      if (from > 1) previousPage = currentPage - 1;
      if (from > count || from === null) {
        from = null;
        to = null;
        nextPage = null;
        previousPage = null;
      }
    }
    if (total > 0) {
      countPage = parseInt(`${total / perPage}`);
      if (countPage % perPage > 0) countPage++;
      if (countPage == 0 && total > 0) countPage = 1;
    } else {
      countPage = 0;
      currentPage = 0;
    }

    const data: MetaPaginationInterface = {
      countPage: countPage,
      currentPage: currentPage,
      nextPage: nextPage,
      previousPage: previousPage,
      perPage: perPage,
      from: from,
      to: to,
      total: total,
    };

    return data;
  }
}
