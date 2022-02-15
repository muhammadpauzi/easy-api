export default interface IPost {
    id: string | number;
    title: string;
    markdown: string;
    sanitizedHtml: string;
    slug: string;
    userId: string | number;
    thumbnail: string;
}
