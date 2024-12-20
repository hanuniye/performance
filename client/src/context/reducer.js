export const initialSate = {
    sideBarToggle: true,
    usersToggle: false,
    productsToggle: false,
    token:null,
    user:null
}

export const SIDEBARTOGGLE = "SIDEBARTOGGLE";
export const USERSTOGGLE = "USERSTOGGLE";
export const PRODUCTSTOGGLE = "PRODUCTSTOGGLE";
export const TOKEN = "TOKEN";
export const USER = "USER";

export const reducer = (state, action) => {
    switch(action.type) {
        case SIDEBARTOGGLE :
            return {
                ...state,
                sideBarToggle: action.payload
            }
        case USERSTOGGLE :
            return {
                ...state,
                usersToggle: action.payload
            }
        case PRODUCTSTOGGLE :
            return {
                ...state,
                productsToggle: action.payload
            }
        case TOKEN :
            return {
                ...state,
                token: action.payload
            }
        case USER :
            return {
                ...state,
                user: action.payload
            }
        default :
            return state;
    }
}

