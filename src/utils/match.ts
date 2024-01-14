export const encryptMatch = (id: string): string => {
    return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`;
}

export const decryptMatch = (match: string): string => {
    let idString: string = match
        .replace(`${process.env.DEFAULT_TOKEN}`, '')
        .replace(`${process.env.DEFAULT_TOKEN}`, '');
        
    return idString;
}