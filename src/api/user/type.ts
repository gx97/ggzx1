export interface loginForm {
    username: string;
    password: string;
}

//出参
export interface responseData{
    code: number;
    message: string;
    ok: boolean;

}


export interface loginResponseData extends responseData {
    data: string
}

export interface userInfoResponseData  extends responseData{
    data: {
        routes: string[]
        buttons: string[]
        roles: string[]
        name: string
        username: string
        avatar: string
      }
}
