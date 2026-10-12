export const money = (n) => '₹' + Number(n).toLocaleString('en-IN')

export const maskPan = (pan) => (pan ? pan.slice(0, 2) + '******' + pan.slice(-2) : '')
