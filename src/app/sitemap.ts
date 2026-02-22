import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://think-prep.vercel.app' // Update with your actual domain

    // Static routes
    const routes = [
        '',
        '/about/prep',
        '/prep-word-dancing',
        '/prep-training',
        '/5d-analysis',
        '/5d-interview',
        '/5d-odyssey',
        '/5d-elenchus',
        '/prep-level-check',
        '/danbi-interview',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
}
