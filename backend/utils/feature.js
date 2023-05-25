class Feature {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr=queryStr;
    }

    search(){
       const keyword = this.queryStr.keyword?{
          name:{
            $regex:this.queryStr.keyword,
            $options:'i'
          } 
       }:{}    
       this.query = this.query.find({...keyword});
    //    console.log(keyword)
       return this
    }


    filter(){
        const queryCopy = {...this.queryStr};
        const removeFeilds = ['keyword','limit','page']
        removeFeilds.forEach(el=>delete queryCopy[el]);
        // this.query = 
    }
}

module.exports = Feature