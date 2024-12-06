class expresserror extends Error{
    constructor(status,message){
    super();
    this.status= status;
    this.message="page is not found"
    }

}