export default function (count, limit = 100) {
    if(count >= limit) {
        return `${limit - 1}+`;
    }

    return count;
}