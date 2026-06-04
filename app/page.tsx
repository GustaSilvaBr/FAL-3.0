import { fetchPageData } from '../lib/data';
import HomePage from '../src/app/HomePage';

// Re-render at most once per hour
export const revalidate = 3600;

export default async function Page() {
  const data = await fetchPageData();
  return <HomePage {...data} />;
}
