var e;import{r as t}from"./vendor.110519aa.js";var a="/static/app.50717f58.png";const o=null!=(e=localStorage.theme)?e:"system";function s(){const[e,a]=t.useState(o);return t.useEffect((()=>{localStorage.theme=e,"dark"===e||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}),[e]),{setTheme:a,theme:e}}export{a,s as u};