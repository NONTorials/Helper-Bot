module.exports = {
    removeMarkdown: (str) => {
        str = str.replace(/`/g, '\\`');
        str = str.replace(/\*/g, '\\*');
        str = str.replace(/\_/g, '\\_');
        str = str.replace(/\|/, '\\|');
        str = str.replace(/\[/g, '(');
        str = str.replace(/\]/g, ')');
        return str;
    }
}