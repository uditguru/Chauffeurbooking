export function setToken(name, token){
    let cdr = typeof window;
    console.log(cdr)
    window.localstorage.setItem(name,token)
}