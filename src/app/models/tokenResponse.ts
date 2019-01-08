export class TokenResponse {
    constructor(public Success: boolean,
        public code: string,
        public Message: string,
        public AccessToken: string = "",
        public RefreshToken: string = "",
        public CsrfToken: string = "",
        public UserName: string = "",
        public Email: string = "",
        public Name: string = "") {
    }
}