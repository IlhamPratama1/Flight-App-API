export default class PaginationService {
    public numberInPage: number;

    constructor(_numberInPage: number) {
        this.numberInPage = _numberInPage;
    }

    public paginate<T>(data: T[], inPage: string) {
        const pageCount: number = Math.ceil(data.length / this.numberInPage);
        let page: number = parseInt(inPage);
        if (!page) { page = 1;}
        if (page > pageCount) {
            page = pageCount
        }
        return({
            "page": page,
            "pageCount": pageCount,
            "data": data.slice(page * this.numberInPage - this.numberInPage, page * this.numberInPage)
        });
    }
}