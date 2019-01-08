export enum ErrorType {
    None = 0,
    PolicyNotFound = 1,
    PolicyIsNotActive = 2,
    PolicyCanNotView = 3,
    ServiceRequestNotFound = 10,
    ServiceRequestDetailNotFetch = 11,
    InvalidServiceRequestForPolicy=12,
    PageNotFoundCode = 404,
    InternalServerError = 500
}