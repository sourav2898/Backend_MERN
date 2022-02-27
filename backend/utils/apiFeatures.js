class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr ? 
        {
            name:{
                $regex: this.queryStr.keyword,
                $options:"i",
            },
        }
        :
        {}

        this.query = this.query.find({...keyword});
        return this;
    }

    filter() {
        const copyQuery = {...this.queryStr};

        const removeFields = ["keyword","limit","page"];

        removeFields.forEach(element => {
            return delete copyQuery[element]
        });

        // Filter for price and ratings
        let queryStr = JSON.stringify(copyQuery);
        queryStr = queryStr.replace(/\b(gt\gte\lt\lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage){
        const currentPage = this.queryStr.page || 1; 
        // result per page = 10; for second page skip 10 results; formula -> 10 * 2-1 = 10
        const skip = resultPerPage * (currentPage - 1); 

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;