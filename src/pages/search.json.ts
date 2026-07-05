import { getCollection } from 'astro:content';

export async function GET() {
  // 这里的 'essay' 对应你项目 src/content/config.ts 里的集合名称（比如 essay、post、blog等）
  const posts = await getCollection('essay' as any).catch(() => getCollection('posts' as any)) || [];

  const body = JSON.stringify(
    posts.map((post: any) => ({
      title: post.data.title,
      description: post.data.description || '',
      url: `/essay/${post.slug || post.id}/`, // 根据你主题文章的真实URL格式调整
    }))
  );

  return new Response(body, {
    headers: { 'Content-Type': 'application/json' }
  });
}