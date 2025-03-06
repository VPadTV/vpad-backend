export const emailRegex = () => /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
export const passwordRegex = () => /.{5,99}/g
export const usernameRegex = () => /[a-z][0-z_\-]{4,34}/gi
export const nicknameRegex = () => /.{5,35}/gi
export const tagRegex = () => /^\w[\w\d ]{1,35}$/g