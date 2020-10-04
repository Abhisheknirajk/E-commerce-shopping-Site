
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    filter() {
        //1a)Filter
        const queryObj = { ...this.queryStr }
        const excludedfields = ['page', 'sort', 'limit', 'fields'];
        excludedfields.forEach(el => delete queryObj[el]);
        //1b)AdvanceFilter
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(queryString));
        console.log(JSON.parse(queryString))
        return this
    }
    sort() {
        //2)SORT
        if (this.queryStr.sort) {
            const SortBy = this.queryStr.sort.split(',').join('');
            console.log(SortBy)
            this.query = this.query.sort(SortBy)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }
    //3)LimitFields
    limitField() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }
        else {
            this.query = this.query.select('-__v');
        }
        return this
    }
    //4)Pagination
    paginate() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this
    }
}
module.exports = ApiFeatures;