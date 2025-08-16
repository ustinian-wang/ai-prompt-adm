import { getCookie, setCookie } from '@ustinian-wang/kit';

const key = '_token_';
export const getToken = ()=>{
    let token = localStorage.getItem(key);
    let token_cookie = getCookie(key);
    return token || token_cookie;
}
export const setToken = (token)=>{
    localStorage.setItem(key, token);
    setCookie(key, token);
}
export const removeToken = ()=>{
    localStorage.removeItem(key);
    setCookie(key, '');
}